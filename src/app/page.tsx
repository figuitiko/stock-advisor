import { InputStockSymbol } from "@/components/intput-stock-symbols";
import { getStockSummary } from "./actions/yahoo";
import { AlertAction } from "@/components/alert-action";
import { BadgeAlert, OctagonMinus } from "lucide-react";
import { TableInfo } from "@/components/table-info";
import { mappingStockResult } from "@/utils/stock";
import { SummaryInfo } from "@/components/summary-info";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import Loading from "./loading";
import { FramerTemplate } from "@/components/framer-template";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const Home = async (props: { searchParams: SearchParams }) => {
  const searchParams = await props.searchParams;
  const { symbol } = searchParams;
  if (!symbol || typeof symbol !== "string") {
    return (
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start p-12">
        <FramerTemplate>
          <div className="w-full flex flex-col gap-8  justify-center  ">
            <InputStockSymbol />
            <Separator />
            <AlertAction heading="Not symbol" symbolSlot={<OctagonMinus />}>
              Please enter a stock symbol
            </AlertAction>
          </div>
        </FramerTemplate>
      </main>
    );
  }
  const data = await getStockSummary(symbol.toString().trim());
  if (data.error) {
    return (
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start p-12">
        <FramerTemplate>
          <div className="w-full flex flex-col gap-8  justify-center  ">
            <InputStockSymbol />
            <Separator />
            <AlertAction heading="Error fetching" symbolSlot={<OctagonMinus />}>
              {data.message}
            </AlertAction>
          </div>
        </FramerTemplate>
      </main>
    );
  }

  const { analysis, gptResponse } = data;

  const { stock, score, recommendation, details } = analysis ?? {};

  const analysisHeading = Object.keys({ stock, score, recommendation }).map(
    (item) => item.toString()
  );
  const analysisRows = Object.values({ stock, score, recommendation }).map(
    (item) => item?.toString() ?? ""
  );
  const detailsHeading = Object.keys(details ?? {}).map(
    (item) =>
      mappingStockResult[item.toString() as keyof typeof mappingStockResult]
  );
  const detailsRows = Object.values(details ?? {}).map(
    (item) => Math.round(item)?.toString() ?? ""
  );

  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start p-12">
      <Suspense key={symbol} fallback={<Loading />}>
        <FramerTemplate>
          <div className="w-full flex flex-col gap-8  justify-center  ">
            <InputStockSymbol />
            <Separator />

            <div>
              {
                <AlertAction
                  heading="Stock Analysis"
                  symbolSlot={<BadgeAlert />}
                >
                  {data.analysis?.recommendation}
                </AlertAction>
              }
            </div>

            <Separator />

            <TableInfo
              caption="Stock Summary"
              headings={analysisHeading}
              rows={[analysisRows]}
            />
            <Separator />

            <TableInfo
              caption="Stock Details"
              headings={detailsHeading}
              rows={[detailsRows]}
            />
            <Separator />

            <SummaryInfo title="Summary Info" description="Stock Analysis">
              {gptResponse}
            </SummaryInfo>
          </div>
        </FramerTemplate>
      </Suspense>
    </main>
  );
};
export default Home;
