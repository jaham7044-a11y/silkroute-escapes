import { useEffect, useState } from "react";
import { loadFirebaseRoutes, type PublicRoute } from "@/lib/public/firebase-routes";

export function useFirebaseRoutes() {
  const [routes, setRoutes] = useState<PublicRoute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    loadFirebaseRoutes()
      .then((r) => {
        if (mounted) setRoutes(r);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { routes, loading };
}