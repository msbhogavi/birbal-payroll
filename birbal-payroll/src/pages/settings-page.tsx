import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Organization, letterheads, and import configuration
        </p>
      </header>

      <Tabs defaultValue="org">
        <TabsList>
          <TabsTrigger value="org">Organization</TabsTrigger>
          <TabsTrigger value="letterheads">Letterheads</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
        </TabsList>
        <TabsContent value="org" className="mt-4 rounded-lg border bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-secondary)]">
          Manage brands, locations, departments, and designations.
        </TabsContent>
        <TabsContent value="letterheads" className="mt-4 rounded-lg border bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-secondary)]">
          Upload letterhead per brand (PNG/JPG, max 2 MB).
        </TabsContent>
        <TabsContent value="import" className="mt-4 rounded-lg border bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-secondary)]">
          Import and review employee data from CSV before you confirm it is correct.
        </TabsContent>
      </Tabs>
    </div>
  );
}
