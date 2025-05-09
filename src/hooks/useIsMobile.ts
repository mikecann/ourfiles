import { useEffect, useState } from "react";

const MOBILE_USER_AGENT =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

export default function useIsMobile() {
  const getIsMobile = () =>
    typeof window !== "undefined" &&
    (window.innerWidth <= 768 || MOBILE_USER_AGENT.test(navigator.userAgent));

  const [isMobile, setIsMobile] = useState(getIsMobile());

  useEffect(() => {
    const update = () => setIsMobile(getIsMobile());
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return isMobile;
}
