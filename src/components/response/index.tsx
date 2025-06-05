import formatMoney from "@/utility/formatMoney";
import {
  OptionType,
  ResponseBalanceType,
  ResponseSetIncomeType,
  ResponsePaydayType,
  ResponsePostPaidType,
  ResponseResetType,
} from "../../../types";

type ResponseData =
  | ResponseBalanceType
  | ResponseSetIncomeType
  | ResponsePaydayType
  | ResponsePostPaidType
  | ResponseResetType
  | string
  | null;

function ResponseComponent({
  option,
  data,
}: {
  option: OptionType;
  data: ResponseData;
}) {
  if (!data) return null;

  const renderResponse = () => {
    if (typeof data === "string") {
      return (
        <>
          <strong className="block text-[#7A5FFF] mb-2">Respuesta:</strong>
          <pre className="whitespace-pre-wrap text-[#8D8E8E] text-sm">
            {data}
          </pre>
        </>
      );
    }

    switch (option) {
      case "balance":
        return (
          <>
            <strong className="block text-[#7A5FFF] mb-2">Balance:</strong>
            <pre className="text-[#8D8E8E] text-sm">
              {formatMoney((data as ResponseBalanceType).currentBalance)}
            </pre>
            <strong className="block text-[#7A5FFF] mb-2">Sueldo:</strong>
            <pre className="text-[#8D8E8E] text-sm">
              {formatMoney((data as ResponseBalanceType).income)}
            </pre>
            <strong className="block text-[#7A5FFF] mb-2">
              Ultima fecha de cobro:
            </strong>
            <pre className="text-[#8D8E8E] text-sm">
              {(data as ResponseBalanceType).lastPayday}
            </pre>
          </>
        );
      case "setIncome":
        return (
          <>
            <strong className="block text-[#7A5FFF] mb-2">
              Salario Actual:
            </strong>
            <pre className="text-[#8D8E8E] text-sm">
              {formatMoney((data as ResponseSetIncomeType).income)}
            </pre>
          </>
        );
      case "payday":
        return (
          <>
            <strong className="block text-[#7A5FFF] mb-2">
              Se ha actualizado el balance
            </strong>
            <pre className="text-[#8D8E8E] text-sm">
              {(data as ResponsePaydayType).message}
            </pre>
          </>
        );
      case "postPaid":
        return (
          <>
            <strong className="block text-[#7A5FFF] mb-2">Monto pagado:</strong>
            <pre className="text-[#8D8E8E] text-sm">
              {(data as ResponsePostPaidType).message}
            </pre>
          </>
        );
      case "reset":
        return (
          <>
            <strong className="block text-[#7A5FFF] mb-2">Reiniciado:</strong>
            <pre className="text-[#8D8E8E] text-sm">{"Éxito"}</pre>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-6 bg-[#22181C] rounded p-4">{renderResponse()}</div>
  );
}

export default ResponseComponent;
