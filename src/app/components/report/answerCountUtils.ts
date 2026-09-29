interface Practice {
  id: string;
  title: string;
  answer?: number | undefined;
  note?: string;
}

interface Domain {
  name?: string;
  practices: Practice[];
}

export const getAnswerCounts = (domains: Domain[]) => {
  const counts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
  domains.forEach((domain) => {
    domain.practices?.forEach((practice) => {
      counts[practice?.answer as keyof typeof counts]++;
    });
  });
  return counts;
};
