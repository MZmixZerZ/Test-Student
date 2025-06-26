export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status?: string;
    role: string;
    companies: string[];
    companySelected: string;
}
