import { addAlpha, defaultColours } from '@utilities/colourUtils';
import { Doughnut } from 'react-chartjs-2';
import type { BaseChartProps } from './Chart';

export type DoughnutChartProps = BaseChartProps & {
    type: 'doughnut';
    label?: string;
};

export function DoughnutChart(props: DoughnutChartProps) {
    return <Doughnut
        options={{}}
        data={{
            labels: props.data.map(({ label }) => label),
            datasets: [
                {
                    label: props.label,
                    data: props.data.map(({ value }) => value),
                    backgroundColor: defaultColours().map((c) => addAlpha(c, 0.5)),
                    borderColor: defaultColours(),
                    borderWidth: 2,
                },
            ],
        }}
    />;
}
