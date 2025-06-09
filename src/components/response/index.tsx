import formatMoney from "@/utility/formatMoney";
import {
  OptionType,
  ResponseBalanceType,
  ResponseSetIncomeType,
  ResponsePaydayType,
  ResponsePostPaidType,
  ResponseResetType,
} from "../../../types";
import { Calendar, DollarSign, Wallet } from "lucide-react";

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
          <div className="space-y-4">
            {/* Balance actual */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">
                  Tu Balance Actual
                </h3>
              </div>
              <div className="text-3xl font-bold text-green-700">
                ${(data as ResponseBalanceType).currentBalance.toLocaleString()}
              </div>
            </div>

            {/* Información de salario */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-800">
                  Tu Salario
                </h3>
              </div>
              <div className="text-2xl font-bold text-blue-700">
                ${(data as ResponseBalanceType).income.toLocaleString()}
                <span className="text-sm font-normal">mensuales</span>
              </div>
            </div>

            {/* Última fecha de cobro */}
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-800">
                  Última Fecha de Cobro
                </h3>
              </div>
              <div className="text-xl font-bold text-purple-700">
                {(data as ResponseBalanceType).lastPayday
                  ? new Date(
                      (data as ResponseBalanceType).lastPayday!
                    ).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Fecha no disponible"}
              </div>
              <div className="text-sm text-purple-600 mt-1">
                Hace{" "}
                {(data as ResponseBalanceType).lastPayday
                  ? Math.floor(
                      (new Date().getTime() -
                        new Date(
                          (data as ResponseBalanceType).lastPayday!
                        ).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  : "N/A"}{" "}
                días
              </div>
            </div>
          </div>
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

  return <div className="mt-6  rounded p-4">{renderResponse()}</div>;
}

export default ResponseComponent;
