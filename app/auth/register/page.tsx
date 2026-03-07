import { redirect } from 'next/navigation';

export default function RegisterPage() {
    // Redirect old registration links to the new unified auth page
    redirect('/auth/login');
}
