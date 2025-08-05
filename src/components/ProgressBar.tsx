"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.configure({ 
        showSpinner: false,
        template: `<div class="bar" role="bar" style="background: #DFFF03 !important; height: 3px !important;"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>`
    });
    NProgress.done();
  }, []);

  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => {
      NProgress.done();
    }, 500); 

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname, searchParams]);

  return null;
}
