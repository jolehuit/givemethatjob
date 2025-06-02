export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 bg-gradient-to-b from-background to-secondary/20">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card shadow-lg rounded-lg px-6 py-8 sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}