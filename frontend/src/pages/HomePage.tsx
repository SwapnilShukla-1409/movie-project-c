
import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/lib/api';
import { QueryFunctionContext, useInfiniteQuery, useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { useIntersection } from '@mantine/hooks';
import { useDebounce } from 'use-debounce';
import MovieForm from '@/components/ui/MovieForm';


import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Use alias

type MovieFormData = Omit<api.Movie, 'id'>;


type MoviesQueryKey = readonly [string, { readonly search: string; readonly type: string }];

export default function HomePage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

 
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<api.Movie | null>(null);

  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

 
  const getApiFilterType = (uiFilterType: string) => {
    return uiFilterType === 'all' ? '' : uiFilterType;
  };

  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingMovies,
 
  } = useInfiniteQuery<api.PaginatedMovies, Error, InfiniteData<api.PaginatedMovies>, MoviesQueryKey, number>({
    queryKey: ['movies', { search: debouncedSearchTerm, type: getApiFilterType(filterType) }],
  
    queryKeyHashFn: (key: MoviesQueryKey) => JSON.stringify(key),
   
    queryFn: ({ pageParam = 1, queryKey }: QueryFunctionContext<MoviesQueryKey, number>) => api.getMovies({ pageParam, queryKey }),
  
    getNextPageParam: (lastPage: api.PaginatedMovies) => {
      return lastPage.meta.hasNextPage ? lastPage.meta.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });


  const { ref, entry } = useIntersection({
    root: null,
    threshold: 1,
  });

  useEffect(() => {
   
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage, isFetchingNextPage]); 

  
  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      setIsAddOpen(false);
      setIsEditOpen(false);
      setIsDeleteOpen(false);
      setSelectedMovie(null);
    },
    onError: (error: any) => {
      console.error(error);
      alert(`Error: ${error.response?.data?.message || 'Failed to perform operation'}`);
    },
  };

  const createMutation = useMutation({
    mutationFn: (newData: MovieFormData) => api.createMovie(newData),
    ...mutationOptions,
  });

  const updateMutation = useMutation({
    mutationFn: (updatedData: MovieFormData) =>
      api.updateMovie(selectedMovie!.id, updatedData),
    ...mutationOptions,
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.deleteMovie(selectedMovie!.id),
    ...mutationOptions,
  });


  const handleLogout = async () => {
    try {
      await api.logout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const handleAddSubmit = (data: MovieFormData) => {
    createMutation.mutate(data);
  };

  const handleEditSubmit = (data: MovieFormData) => {
    
    if (selectedMovie) {
      updateMutation.mutate(data);
    }
  };

  const handleDeleteConfirm = () => {
    
    if (selectedMovie) {
      deleteMutation.mutate();
    }
  };


  const movies = data?.pages?.flatMap((page) => page.data) ?? [];

  return (
    
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
      {}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 md:py-6 border-b">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Your Movies</h1>
          {}
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Welcome, {user?.email}</p>
        </div>
        {}
        <Button onClick={handleLogout} variant="outline" size="sm" className="inline-flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </Button>
      </header>

      {}
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 mb-4 md:mb-6">
        <div className="flex-1 min-w-[200px] w-full sm:w-auto sm:max-w-xs md:max-w-sm">
          <Input
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Movie">Movie</SelectItem>
            <SelectItem value="TV Show">TV Show</SelectItem>
          </SelectContent>
        </Select>
        {}
        <Button variant="outline" className="w-full sm:w-auto sm:ml-auto inline-flex items-center gap-2" onClick={() => setIsAddOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Add New Entry
        </Button>
      </div>

      {}
      {}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Movie/Show</DialogTitle>
            <DialogDescription>
              Enter the details of the movie or TV show you want to add to your collection.
            </DialogDescription>
          </DialogHeader>
          <MovieForm
            onSubmit={handleAddSubmit}
            isSubmitting={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Entry</DialogTitle>
            <DialogDescription>
              Update the details of "{selectedMovie?.title}".
            </DialogDescription>
          </DialogHeader>
          {selectedMovie && (
            <MovieForm
              onSubmit={handleEditSubmit}
              isSubmitting={updateMutation.isPending}
              defaultValues={selectedMovie}
            />
          )}
        </DialogContent>
      </Dialog>

      {}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete "{selectedMovie?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {}
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {}
      {}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b hover:bg-muted/50">
              <TableHead className="w-[100px] p-4">Poster</TableHead>
              <TableHead className="p-4">Title</TableHead>
              <TableHead className="p-4 hidden md:table-cell">Type</TableHead>
              <TableHead className="p-4 hidden lg:table-cell">Director</TableHead>
              <TableHead className="w-[80px] text-center p-4">Year</TableHead>
              <TableHead className="w-[80px] text-right p-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {}
            {isLoadingMovies && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center p-4">
                  <div className="flex items-center justify-center text-muted-foreground">
                    <svg className="animate-spin h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            )}
            {}
            {!isLoadingMovies && movies.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center p-4">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 h-8 w-8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    <p className="font-medium">No entries found.</p>
                    <p className="text-sm">Add your first movie or TV show.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {}
            {}
            {!isLoadingMovies && movies.map((movie: api.Movie, index: number) => (
              <TableRow key={movie.id} ref={index === movies.length - 1 ? ref : null} className="border-b">
                <TableCell className="p-4 align-top">
                  {movie.posterUrl ? (
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title} 
                      className="h-16 w-12 object-cover rounded-md shadow-sm border" 
                      onError={(e) => { // Basic image error handling
                         const target = e.target as HTMLImageElement;
                         target.onerror = null; // Prevent infinite loop
                         target.src = `https://placehold.co/48x64/E2E8F0/A0AEC0?text=No+Img`;
                       }}
                       loading="lazy"
                    />
                  ) : (
                    <div className="h-16 w-12 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground shadow-sm border">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.2 3.6L10.8 2.4C10.3 2.3 9.7 2.3 9.2 2.4L4.8 3.6C3.1 4 2 5.5 2 7.2V16.7C2 18.5 3.1 19.9 4.8 20.3L9.2 21.5C9.7 21.7 10.3 21.7 10.8 21.5L15.2 20.3C16.9 19.9 18 18.4 18 16.7V7.2C18 5.5 16.9 4.1 15.2 3.6Z"/><path d="M22 12C22 15.9 18.9 19 15 19"/><path d="M22 8V16"/></svg>
                    </div>
                  )}
                </TableCell>
                <TableCell className="p-4 align-top">
                  <div className="font-medium">{movie.title}</div>
                  <div className="text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">{movie.location}</div>
                  {}
                  <div className="text-xs text-muted-foreground mt-1 lg:hidden">{movie.director}</div>
                  <div className="text-xs text-muted-foreground mt-1 md:hidden">{movie.type}</div>
                </TableCell>
                <TableCell className="p-4 align-top hidden md:table-cell">
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                    {movie.type}
                  </div>
                </TableCell>
                <TableCell className="p-4 align-top hidden lg:table-cell">{movie.director}</TableCell>
                <TableCell className="text-center p-4 align-top">{movie.year}</TableCell>
                <TableCell className="text-right p-4 align-top">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <span className="sr-only">Open menu</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      {}
                      <DropdownMenuItem onClick={() => { setSelectedMovie(movie); setIsEditOpen(true); }} className="inline-flex items-center gap-2 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"/></svg>
                        Edit
                      </DropdownMenuItem>
                      {}
                      <DropdownMenuItem onClick={() => { setSelectedMovie(movie); setIsDeleteOpen(true); }} className="text-destructive focus:text-destructive inline-flex items-center gap-2 cursor-pointer">
                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {}
            {isFetchingNextPage && (
              <TableRow>
                <TableCell colSpan={6} className="h-16 text-center p-4">
                  <div className="flex items-center justify-center text-muted-foreground text-sm">
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading more...
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}