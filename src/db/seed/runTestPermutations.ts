(async () => {
  const args = process.argv[2];
  console.log(args);

  const testPermutationsQuery = await fetch(
    `http://localhost:3000/api/v1/test-permutations?limit=10000&markingRunId=${args}`
  );
  const testPermutations = await testPermutationsQuery.json();

  for (const permutation of testPermutations.data) {
    console.log(permutation);
    const runQuery = await fetch(
      `http://localhost:3000/api/v1/test-permutations/${permutation.id}/run/direct`,
      {
        method: "POST",
      }
    );
    const run = await runQuery.json();
    console.log(run.data);
  }

  process.exit(); // Exit the program
})();
