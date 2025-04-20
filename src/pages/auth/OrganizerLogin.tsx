import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { Vote } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PageLayout } from '@/components/layout/PageLayout';

const loginSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function OrganizerLogin() {
  const { login, isLoading } = useAuth();

  return (
    <PageLayout>
      <div className="container flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-2">
              <div className="flex justify-center">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center mb-4">
                  <Vote className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Organizer Login</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={loginSchema}
                onSubmit={async (values) => {
                  await login(values.email, values.password, 'organizer');
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <ErrorMessage name="email" component="div" className="text-sm text-destructive" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="password" className="text-sm font-medium">
                          Password
                        </label>
                      </div>
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <ErrorMessage name="password" component="div" className="text-sm text-destructive" />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting || isLoading}
                    >
                      {(isSubmitting || isLoading) ? (
                        <>
                          <LoadingSpinner size="small" className="mr-2" />
                          <span>Logging in...</span>
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Register here
                </Link>
              </div>
              <div className="text-sm text-center text-muted-foreground">
                <Link to="/login/voter" className="text-primary hover:underline">
                  Login as a voter instead
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}