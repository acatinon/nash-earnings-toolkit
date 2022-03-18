import useSWR from 'swr';
import { DateTime, Interval, Duration } from 'luxon';
import BigNumber from "bignumber.js";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default (props) => {
  const fetcher = (input: RequestInfo, init?: RequestInit) => fetch(input, init).then(res => res.json())
  let { data, error } = useSWR('/data/earning.json', fetcher)

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
        <YAxis ticks={[0, 500_000, 1_000_000, 1_500_000, 2_000_000]} />
        <Tooltip />
        <CartesianGrid />
        <Bar type="stepAfter" dataKey="aBUSD" stackId="1" fill="#3F3F46" />
        <Bar type="stepAfter" dataKey="aDAI" stackId="1" fill="#F59E0B" />
        <Bar type="stepAfter" dataKey="aGUSD" stackId="1" fill="#0EA5E9" />
        <Bar type="stepAfter" dataKey="aUSDC" stackId="1" fill="#2563EB" />
        <Bar type="stepAfter" dataKey="aUSDT" stackId="1" fill="#10B981" />
        <Bar type="stepAfter" dataKey="aUST" stackId="1" fill="#6366F1" />
      </BarChart>
    </ResponsiveContainer>
  );
}

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
      let newElement = { name: currentDate.toFormat("kkkk-WW"), year: currentDate.year, month: currentDate.month };

      for (const asset in lastKnownValues) {
        newElement[asset] = lastKnownValues[asset];
      }

      data.splice(i, 0, newElement);
    }

    element.year = currentDate.year;
    element.month = currentDate.month;

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