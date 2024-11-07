import Grid from '@/components/Grid/Grid';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Poker Range Manager
      </h1>
      {/* Toggle testMode to true to simulate localStorage errors */}
      <Grid testMode={false} />
    </main>
  );
}
