interface IChartDataTableProps {
	caption: string
	columns: [string, string]
	rows: { label: string; value: string }[]
}

export const ChartDataTable = ({
	caption,
	columns,
	rows,
}: IChartDataTableProps) => (
	<div className="sr-only">
		<table>
			<caption>{caption}</caption>
			<thead>
				<tr>
					<th scope="col">{columns[0]}</th>
					<th scope="col">{columns[1]}</th>
				</tr>
			</thead>
			<tbody>
				{rows.map((row) => (
					<tr key={row.label}>
						<th scope="row">{row.label}</th>
						<td>{row.value}</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
)
