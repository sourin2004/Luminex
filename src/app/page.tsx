import Calculator from '@/components/calculator/calculator';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 selection:bg-primary/20 selection:text-primary">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl text-center mb-6">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-primary drop-shadow-[0_0_10px_hsl(var(--primary))]">
          NeonMath
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">The Futuristic Scientific Calculator</p>
      </div>
      <Calculator />
    </main>
  );
}
