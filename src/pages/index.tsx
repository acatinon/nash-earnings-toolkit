import useSWR from 'swr';
import BigNumber from 'bignumber.js';
import { DateTime, Interval, Duration } from 'luxon';
import { format } from "d3-format";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const fetcher = (input: RequestInfo, init?: RequestInit) => fetch(input, init).then(res => res.json());

export default (props) => {
  return (
    <>
      <h2>Earning total assets</h2>
      <div className="h-96">
        <TotalAssetsChart />
      </div>
    </>

  );
}

const TotalAssetsChart = (props) => {

  let { data, error } = useSWR('/data/earning.json', fetcher);
  const formatNumber = format(".2s");

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  data = normalizeData(data);
  console.log(data);

  return (
    <ResponsiveContainer>
      <BarChart data={data}>
        <XAxis dataKey="name" xAxisId={0} hide={true} />
        <XAxis dataKey="month" xAxisId={1} allowDuplicatedCategory={false} tickLine={false} />
        <XAxis dataKey="year" xAxisId={2} allowDuplicatedCategory={false} tickLine={false} />
        <YAxis ticks={[0, 500_000, 1_000_000, 1_500_000, 2_000_000]} tickFormatter={(v) => formatNumber(v)} />
        <Tooltip content={customTooltip} />
        <CartesianGrid />
        <Bar type="stepAfter" dataKey="aBUSD" stackId="1" fill="#78716C" />
        <Bar type="stepAfter" dataKey="aDAI" stackId="1" fill="#F59E0B" />
        <Bar type="stepAfter" dataKey="aGUSD" stackId="1" fill="#0EA5E9" />
        <Bar type="stepAfter" dataKey="aUSDC" stackId="1" fill="#2563EB" />
        <Bar type="stepAfter" dataKey="aUSDT" stackId="1" fill="#10B981" />
        <Bar type="stepAfter" dataKey="aUST" stackId="1" fill="#6366F1" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const customTooltip = (props) => {
  if (props.active && props.payload && props.payload.length) {
    const fullPayload = props.payload[0].payload;
    const rows = props.payload.map(p => (
      <tr>
        <td>{p.name}</td>
        <td className="text-right">{new BigNumber(p.value).toFormat(2)}</td>
      </tr>
    ));
    return (
      <div className="bg-white/80 p-1 w-48 rounded shadow">
        <div><strong>Week {fullPayload.week}</strong> ({fullPayload.month} {fullPayload.year})</div>
        <table className="w-full">
          {rows}
        </table>
      </div>
    );
  }

  return null;
};
function normalizeData(data) {
  let lastKnownValues = {
    "aUSDC": 0,
    "aDAI": 0,
    "aUSDT": 0,
    "aGUSD": 0,
    "aBUSD": 0,
    "aUST": 0
  };

  for (let i = 0; i < data.length; i++) {
    let element = data[i];
    let currentDate = DateTime.fromFormat(element.name, "kkkk-WW")

    while (i > 0 && Interval.fromDateTimes(DateTime.fromFormat(data[i - 1].name, "kkkk-WW"), currentDate).length("weeks") > 1) {

      currentDate = currentDate.minus(Duration.fromObject({ weeks: 1 }));
      let newElement = {
        name: currentDate.toFormat("kkkk-WW"),
        year: currentDate.year,
        month: currentDate.toFormat("LLL"),
        week: currentDate.toFormat("WW")
      };

      for (const asset in lastKnownValues) {
        newElement[asset] = lastKnownValues[asset];
      }

      data.splice(i, 0, newElement);
    }

    element.year = currentDate.year;
    element.month = currentDate.toFormat("LLL");
    element.week = currentDate.toFormat("WW");

    for (const asset in lastKnownValues) {
      if (element[asset]) {
        lastKnownValues[asset] = element[asset];
      }
      else {
        element[asset] = lastKnownValues[asset];
      }
    }
  }

  return data;
}