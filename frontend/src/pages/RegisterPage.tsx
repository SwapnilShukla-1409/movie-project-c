import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterData } from '../lib/schemas'; 
import * as api from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const navigate = useNavigate();

  const form = useForm<RegisterData>({ 
    resolver: zodResolver(registerSchema), 
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      await api.register(data);
     
      navigate('/login'); 
    } catch (error) {
      console.error('Registration failed', error);
     
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle> {}
          <CardDescription>Enter your email and password to create an account.</CardDescription> {/* Update description */}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      {}
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage /> {}
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Registering..." : "Create account"} {}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline"> {}
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}