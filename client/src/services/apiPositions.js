    export const getPositions = async () => {
      const res = await fetch(
        "https://frontend-test-assignment-api.abz.agency/api/v1/positions"
      );
      if (!res.ok) throw new Error("Failed to fetch positions");
      return res.json(); // Повертає об'єкт з полем `positions`
    };
