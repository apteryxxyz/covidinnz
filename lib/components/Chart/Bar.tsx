import { addAlpha, defaultColours } from '@utilities/colourUtils';
import { Bar } from 'react-chartjs-2';
import type { BaseChartProps } from './Chart';

export type BarChartProps = BaseChartProps & {
    type: 'bar';
    labels: string[];
    align: 'horizontal' | string;
};

export function BarChart(props: BarChartProps) {
    return <Bar
        options={{
            indexAxis: props.align === 'horizontal' ? 'x' : 'y',
            plugins: {
                legend: { display: false },
            },
        }}
        data={{
            labels: props.labels,
            datasets: [
                {
                    label: '',
                    data: props.data.map(({ value }) => value),
                    backgroundColor: defaultColours().map((c) => addAlpha(c, 0.5)),
                    borderColor: defaultColours(),
                    borderWidth: 2,
                },
            ],
        }}
    />;
}
