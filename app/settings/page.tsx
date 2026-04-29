import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import FormSubmitButton from "@/components/form-submit-button";
import { DashboardToast } from "@/components/dashboard-toast";
import { CurrencyPreference } from "./currency-preference";

const updateProfile = async (formData: FormData) => {
  "use server";
  const displayName = formData.get("displayName") as string;
  const avatarUrl = formData.get("avatarUrl") as string;
  const supabase = await createClient();
  await supabase.auth.updateUser({
    data: { user_name: displayName, user_avatar: avatarUrl },
  });
  redirect("/settings?success=profile-updated");
};

export default async function Page() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const name = data.claims.user_name || "";
  const email = data.claims.email as string;
  const avatar = data.claims.user_avatar || "";

  const userData = {
    name,
    email,
    avatar,
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" userdata={userData} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <div>
                <h1 className="text-2xl font-semibold">Settings</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Manage your account settings and preferences.
                </p>
              </div>

              <Tabs defaultValue="profile" className="w-full max-w-2xl">
                <TabsList>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="danger">Danger Zone</TabsTrigger>
                </TabsList>

                {/* Tab 1: Profile */}
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile</CardTitle>
                      <CardDescription>
                        Update your display name and avatar URL.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form action={updateProfile}>
                        <FieldGroup>
                          <Field>
                            <FieldLabel htmlFor="displayName">
                              Display Name
                            </FieldLabel>
                            <Input
                              id="displayName"
                              name="displayName"
                              defaultValue={name}
                              placeholder="Your name"
                            />
                          </Field>
                          <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                              id="email"
                              name="email"
                              defaultValue={email}
                              disabled
                              className="opacity-60 cursor-not-allowed"
                            />
                          </Field>
                          <Field>
                            <FieldLabel htmlFor="avatarUrl">
                              Avatar URL
                            </FieldLabel>
                            <Input
                              id="avatarUrl"
                              name="avatarUrl"
                              defaultValue={avatar}
                              placeholder="https://..."
                            />
                          </Field>
                          <Field>
                            <FormSubmitButton />
                          </Field>
                        </FieldGroup>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab 2: Preferences */}
                <TabsContent value="preferences">
                  <Card>
                    <CardHeader>
                      <CardTitle>Preferences</CardTitle>
                      <CardDescription>
                        Customize how the app behaves for you.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FieldGroup>
                        <Field>
                          <FieldLabel>Preferred Currency</FieldLabel>
                          <CurrencyPreference />
                        </Field>
                      </FieldGroup>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab 3: Danger Zone */}
                <TabsContent value="danger">
                  <Card className="border-destructive">
                    <CardHeader>
                      <CardTitle className="text-destructive">
                        Danger Zone
                      </CardTitle>
                      <CardDescription>
                        Irreversible actions for your account.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border border-destructive/50 p-4 flex flex-col gap-3">
                        <div>
                          <p className="font-medium text-sm">Delete Account</p>
                          <p className="text-muted-foreground text-sm mt-1">
                            Contact support to delete your account and all data.
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          disabled
                          className="w-fit"
                        >
                          Delete Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </SidebarInset>
      <DashboardToast />
    </SidebarProvider>
  );
}
