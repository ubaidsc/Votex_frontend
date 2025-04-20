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
  cnic: Yup.string()
    .matches(/^\d{5}-\d{7}-\d{1}$/, 'CNIC must be in format: 12345-1234567-1')
    .required('CNIC is required'),
  password: Yup.string()
    .required('Password is required'),
});

export default function VoterLogin() {
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
              <CardTitle className="text-2xl text-center">Voter Login</CardTitle>
              <CardDescription className="text-center">
                Enter your CNIC and password to access voting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={{ cnic: '', password: '' }}
                validationSchema={loginSchema}
                onSubmit={async (values) => {
                  await login(values.cnic, values.password, 'voter');
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="cnic" className="text-sm font-medium">
                        CNIC
                      </label>
                      <Field
                        id="cnic"
                        name="cnic"
                        type="text"
                        placeholder="12345-1234567-1"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <ErrorMessage name="cnic" component="div" className="text-sm text-destructive" />
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
            <CardFooter>
              <div className="text-sm text-center w-full text-muted-foreground">
                <Link to="/login/organizer" className="text-primary hover:underline">
                  Login as an organizer instead
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}