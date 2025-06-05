"use client";
import { RotateCcw } from "lucide-react";
import React, { useState } from "react";
import { OptionType } from "../../types";
import ResponseComponent from "@/components/response";

export default function Page() {
  const [option, setOption] = useState<OptionType>("balance");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [salary, setIncome] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (value: OptionType) => {
    setOption(value);
    setResponse(null);
  };
  // Reset loading state when changing options

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    const body: {
      phone: string;
      action?: string;
      title?: string;
      amount?: number;
      category?: string;
    } = { phone };

    switch (option) {
      case "balance":
        body.action = "balance";
        break;
      case "payday":
        body.action = "payday";
        break;
      case "postPaid":
        body.action = "postPaid";
        body.title = title;
        body.amount = Number(amount);
        if (category) body.category = category;
        break;
      case "setIncome":
        body.action = "setIncome";
        body.amount = Number(salary);
        break;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/${body.action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      console.log(data);
      setResponse(data);
    } catch {
      setResponse("Error al enviar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!phone) {
      setResponse("Por favor ingrese el número de teléfono antes de resetear.");
      return;
    }
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch("http://localhost:3000/api/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch {
      setResponse("Error al enviar la solicitud de reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#22181C] py-10">
      <div className="max-w-xl mx-auto font-sans bg-[#312F2F] shadow-lg rounded-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-center flex-1 text-white">
            Finanzas
          </h2>
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              title="Resetear datos"
              className="p-1 rounded hover:bg-[#8D8E8E] transition-colors disabled:opacity-60"
            >
              <RotateCcw color="#7A5FFF" />
            </button>
          </div>
        </div>
        <div className="mb-6 flex flex-row gap-3 justify-center">
          {[
            { value: "balance", label: "Obtener Balance" },
            { value: "payday", label: "Avisar Día de Pago" },
            { value: "postPaid", label: "Agregar Gasto" },
            { value: "setIncome", label: "Definir Salario" },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`px-4 py-2 rounded cursor-pointer transition-colors border flex items-center gap-2
            ${
              option === opt.value
                ? "bg-[#7A5FFF] text-[#22181C] border-[#7A5FFF]"
                : "bg-[#8D8E8E] text-[#22181C] border-[#8D8E8E] hover:bg-[#7A5FFF] hover:text-[#22181C]"
            }`}
            >
              <input
                type="radio"
                name="option"
                value={opt.value}
                checked={option === opt.value}
                onChange={() => handleOptionChange(opt.value as OptionType)}
                className="hidden"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-1">
              Número de Teléfono:
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="mt-1 p-2 block w-full rounded border-[#8D8E8E] bg-[#22181C] text-[#7A5FFF] shadow-sm focus:ring-[#7A5FFF] focus:border-[#7A5FFF]"
              />
            </label>
          </div>
          {option === "postPaid" && (
            <>
              <div>
                <label className="block text-white font-medium mb-1">
                  Categoría (opcional):
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 p-2 block w-full rounded border-[#8D8E8E] bg-[#22181C] text-[#7A5FFF] shadow-sm focus:ring-[#7A5FFF] focus:border-[#7A5FFF]"
                  />
                </label>
              </div>
              <div>
                <label className="block text-white font-medium mb-1">
                  Título:
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1 p-2 block w-full rounded border-[#8D8E8E] bg-[#22181C] text-[#7A5FFF] shadow-sm focus:ring-[#7A5FFF] focus:border-[#7A5FFF]"
                  />
                </label>
              </div>
              <div>
                <label className="block text-white font-medium mb-1">
                  Monto:
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5FFF] font-semibold select-none">
                      $
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="^\d*([.,]\d{0,2})?$"
                      value={amount}
                      onChange={(e) => {
                        // Solo permitir números y máximo dos decimales
                        let val = e.target.value.replace(/[^0-9.,]/g, "");
                        // Reemplazar coma por punto para normalizar
                        val = val.replace(",", ".");
                        // Permitir solo dos decimales
                        if (val.includes(".")) {
                          const [int, dec] = val.split(".");
                          val = int + "." + (dec ? dec.slice(0, 2) : "");
                        }
                        setAmount(val);
                      }}
                      required
                      className="mt-1 pl-7 p-2 block w-full rounded border-[#8D8E8E] bg-[#22181C] text-[#7A5FFF] shadow-sm focus:ring-[#7A5FFF] focus:border-[#7A5FFF]"
                      placeholder="0.00"
                    />
                  </div>
                </label>
              </div>
            </>
          )}
          {option === "setIncome" && (
            <div>
              <label className="block text-white font-medium mb-1">
                Salario Mensual:
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5FFF] font-semibold select-none">
                    $
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="^\d*([.,]\d{0,2})?$"
                    value={salary}
                    onChange={(e) => {
                      // Solo permitir números y máximo dos decimales
                      let val = e.target.value.replace(/[^0-9.,]/g, "");
                      // Reemplazar coma por punto para normalizar
                      val = val.replace(",", ".");
                      // Permitir solo dos decimales
                      if (val.includes(".")) {
                        const [int, dec] = val.split(".");
                        val = int + "." + (dec ? dec.slice(0, 2) : "");
                      }
                      setIncome(val);
                    }}
                    required
                    className="mt-1 pl-7 p-2 block w-full rounded border-[#8D8E8E] bg-[#22181C] text-[#7A5FFF] shadow-sm focus:ring-[#7A5FFF] focus:border-[#7A5FFF]"
                    placeholder="0.00"
                  />
                </div>
              </label>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-[#7A5FFF] text-[#22181C] font-semibold rounded hover:bg-[#8D8E8E] hover:text-[#22181C] transition-colors disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>
        <ResponseComponent data={response} option={option} />
      </div>
    </div>
  );
}
