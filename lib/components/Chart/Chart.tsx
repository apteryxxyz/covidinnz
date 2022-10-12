import type { BarChartProps } from './Bar';
import { BarChart } from './Bar';
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import type { DoughnutChartProps } from './Doughnut';
import { DoughnutChart } from './Doughnut';
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export interface BaseChartProps {
    type: 'bar' | 'doughnut';
    data: {
        label: string;
        value: string | number;
    }[];
}

export type ChartProps = BarChartProps | DoughnutChartProps;

export function Chart(props: ChartProps) {
    function SwitchCase() {
        switch (props.type) {
            case 'bar':
                return <BarChart {...props} />;
            case 'doughnut':
                return <DoughnutChart {...props} />;
            default:
                throw 'No chart type specified';
        }
    }

    return <SwitchCase />;
}
