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

const registerSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function Register() {
  const { register, isLoading } = useAuth();

  return (
    <PageLayout>
      <div className="container flex items-center justify-center min-h-[calc(100vh-3.5rem)] py-8">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-2">
              <div className="flex justify-center">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center mb-4">
                  <Vote className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Register as Organizer</CardTitle>
              <CardDescription className="text-center">
                Create an account to manage elections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
                validationSchema={registerSchema}
                onSubmit={async (values) => {
                  await register(values.name, values.email, values.password);
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <Field
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <ErrorMessage name="name" component="div" className="text-sm text-destructive" />
                    </div>
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
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <ErrorMessage name="password" component="div" className="text-sm text-destructive" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="text-sm font-medium">
                        Confirm Password
                      </label>
                      <Field
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <ErrorMessage name="confirmPassword" component="div" className="text-sm text-destructive" />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting || isLoading}
                    >
                      {(isSubmitting || isLoading) ? (
                        <>
                          <LoadingSpinner size="small" className="mr-2" />
                          <span>Registering...</span>
                        </>
                      ) : (
                        'Register'
                      )}
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-center w-full text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login/organizer" className="text-primary hover:underline">
                  Login here
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}