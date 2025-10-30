import { Movie } from '../lib/api';
type MovieFormData = Omit<Movie, 'id'>;
interface MovieFormProps {
    onSubmit: (data: MovieFormData) => void;
    defaultValues?: Partial<MovieFormData>;
    isSubmitting: boolean;
}
export default function MovieForm({ onSubmit, defaultValues, isSubmitting }: MovieFormProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=MovieForm.d.ts.map