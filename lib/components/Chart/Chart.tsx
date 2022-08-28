import { BarChart, BarChartProps } from './Bar';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from 'chart.js';
import { DoughnutChart, DoughnutChartProps } from './Doughnut';
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
