'use client'
import { CardContent } from '@/components/ui/card';
import { DashboardCard } from "../../shared/dashboard-card";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export default function UpdateBanner() {
  return (
    <DashboardCard className="py-3">
      <CardContent className="flex items-center flex-wrap justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-chart-1 animate-ping absolute inline-flex" />
            <span className="h-2 w-2 rounded-full bg-chart-1 absolute inline-flex" />
            <p className="text-sm font-medium  ps-4">به‌روزرسانی</p>
            <span className="w-1 h-1 rounded-full bg-border" />
            <p className="text-sm font-normal text-muted-foreground">
              {new Date().toLocaleDateString('fa-IR', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <p className="text-sm font-normal">
            درآمد فروش در یک هفته <span className="text-emerald-600">۴۰٪</span> افزایش یافت
          </p>
        </div>
        <Link to={'#'}>
          <Button variant={'outline'} className="flex gap-1.5 px-4 py-2 h-auto rounded-md cursor-pointer">
            مشاهده آمار
            <span>
              <ArrowRight width={18} height={18} className="rtl:rotate-180" />
            </span>
          </Button>
        </Link>
      </CardContent>
    </DashboardCard>
  );
}
