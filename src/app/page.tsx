"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  RotateCcw,
  DollarSign,
  Calendar,
  Wallet,
  TrendingDown,
  History,
  Filter,
} from "lucide-react";
import { OptionType } from "../../types";
import ResponseComponent from "@/components/response";

export default function PersonalFinance() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedOption, setSelectedOption] = useState<OptionType>("");
  const [formData, setFormData] = useState(defaultFormData);
  const [expenseHistory] = useState([
    {
      id: 1,
      amount: 1500,
      category: "food",
      date: "2024-01-15",
      description: "Supermercado semanal",
    },
    {
      id: 2,
      amount: 800,
      category: "transport",
      date: "2024-01-14",
      description: "Gasolina",
    },
    {
      id: 3,
      amount: 2500,
      category: "entertainment",
      date: "2024-01-12",
      description: "Cena en restaurante",
    },
    {
      id: 4,
      amount: 450,
      category: "utilities",
      date: "2024-01-10",
      description: "Recarga de celular",
    },
    {
      id: 5,
      amount: 3200,
      category: "health",
      date: "2024-01-08",
      description: "Consulta médica",
    },
  ]);
  const [historyFilter, setHistoryFilter] = useState({
    category: "",
    dateFrom: "",
    dateTo: "",
  });
  const [response, setResponse] = useState<string | null>(null);

  const handleReset = () => {
    setPhoneNumber("");
    setSelectedOption("");
    setFormData(defaultFormData);
    setHistoryFilter({
      category: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body: {
      phone: string;
      action?: string;
      description?: string;
      amount?: number;
      category?: string;
    } = { phone: phoneNumber };

    switch (selectedOption) {
      case "balance":
        body.action = "balance";
        break;
      case "payday":
        body.action = "payday";
        break;
      case "postPaid":
        body.action = "postPaid";
        if (formData.description) body.description = formData.description;
        body.amount = Number(formData.amount);
        body.category = formData.category;
        break;
      case "setIncome":
        body.action = "setIncome";
        body.amount = Number(formData.salary);
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
    } catch (e) {
      console.log(e);
    }
  };

  const renderFormInputs = () => {
    switch (selectedOption) {
      case "balance":
        return (
          <div className="space-y-4">
            {!response ? (
              <div className="text-center p-6 bg-muted rounded-lg">
                <DollarSign className="h-12 w-12 mx-auto mb-2 text-green-600" />
                <p className="text-sm text-muted-foreground">
                  Se consultará tu balance actual con el número de teléfono
                  proporcionado
                </p>
              </div>
            ) : (
              <ResponseComponent data={response} option={selectedOption} />
            )}
          </div>
        );

      case "payday":
        return (
          <div className="space-y-4">
            <div className="text-center p-6 bg-muted rounded-lg">
              <DollarSign className="h-12 w-12 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-muted-foreground">
                Se avisara que se cobro el sueldo.
              </p>
            </div>
          </div>
        );

      case "setIncome":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Salario mensual</Label>
              <Input
                id="salary"
                type="number"
                placeholder="Ej: 50000"
                value={formData.salary}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, salary: e.target.value }))
                }
              />
            </div>
          </div>
        );

      case "postPaid":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expenseAmount">Monto del gasto</Label>
              <Input
                id="expenseAmount"
                type="number"
                placeholder="Ej: 1500"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Alimentación</SelectItem>
                  <SelectItem value="transport">Transporte</SelectItem>
                  <SelectItem value="entertainment">Entretenimiento</SelectItem>
                  <SelectItem value="utilities">Servicios</SelectItem>
                  <SelectItem value="health">Salud</SelectItem>
                  <SelectItem value="shopping">Compras</SelectItem>
                  <SelectItem value="other">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Describe el gasto..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="min-h-[80px]"
              />
            </div>
          </div>
        );

      case "history":
        const getCategoryName = (category: string) => {
          const categories = {
            food: "Alimentación",
            transport: "Transporte",
            entertainment: "Entretenimiento",
            utilities: "Servicios",
            health: "Salud",
            shopping: "Compras",
            other: "Otros",
          };
          return categories[category as keyof typeof categories] || category;
        };

        const filteredHistory = expenseHistory.filter((expense) => {
          const matchesCategory =
            !historyFilter.category ||
            expense.category === historyFilter.category;
          const matchesDateFrom =
            !historyFilter.dateFrom || expense.date >= historyFilter.dateFrom;
          const matchesDateTo =
            !historyFilter.dateTo || expense.date <= historyFilter.dateTo;
          return matchesCategory && matchesDateFrom && matchesDateTo;
        });

        const totalAmount = filteredHistory.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );

        return (
          <div className="space-y-4">
            {/* Filtros */}
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="h-4 w-4" />
                <span className="font-medium text-sm">Filtros</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="filterCategory" className="text-xs">
                    Categoría
                  </Label>
                  <Select
                    value={historyFilter.category}
                    onValueChange={(value) =>
                      setHistoryFilter((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      <SelectItem value="food">Alimentación</SelectItem>
                      <SelectItem value="transport">Transporte</SelectItem>
                      <SelectItem value="entertainment">
                        Entretenimiento
                      </SelectItem>
                      <SelectItem value="utilities">Servicios</SelectItem>
                      <SelectItem value="health">Salud</SelectItem>
                      <SelectItem value="shopping">Compras</SelectItem>
                      <SelectItem value="other">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="dateFrom" className="text-xs">
                    Desde
                  </Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    className="h-8"
                    value={historyFilter.dateFrom}
                    onChange={(e) =>
                      setHistoryFilter((prev) => ({
                        ...prev,
                        dateFrom: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="dateTo" className="text-xs">
                    Hasta
                  </Label>
                  <Input
                    id="dateTo"
                    type="date"
                    className="h-8"
                    value={historyFilter.dateTo}
                    onChange={(e) =>
                      setHistoryFilter((prev) => ({
                        ...prev,
                        dateTo: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Resumen */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-red-800">
                  Total gastado:
                </span>
                <span className="text-lg font-bold text-red-600">
                  ${totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-red-600 mt-1">
                {filteredHistory.length} gasto
                {filteredHistory.length !== 1 ? "s" : ""} encontrado
                {filteredHistory.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Lista de gastos */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredHistory.length === 0 ? (
                <div className="text-center p-6 bg-muted rounded-lg">
                  <TrendingDown className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No se encontraron gastos con los filtros aplicados
                  </p>
                </div>
              ) : (
                filteredHistory.map((expense) => (
                  <div
                    key={expense.id}
                    className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {getOptionIcon(
                          expense.category === "food"
                            ? "postPaid"
                            : expense.category === "transport"
                            ? "postPaid"
                            : "postPaid"
                        )}
                        <span className="font-medium">
                          ${expense.amount.toLocaleString()}
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {getCategoryName(expense.category)}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(expense.date).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {expense.description && (
                      <p className="text-sm text-gray-600">
                        {expense.description}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center p-6 bg-muted rounded-lg">
            <Wallet className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Selecciona una opción para comenzar
            </p>
          </div>
        );
    }
  };

  const getOptionIcon = (option: OptionType) => {
    switch (option) {
      case "balance":
        return <DollarSign className="h-4 w-4" />;
      case "payday":
        return <Calendar className="h-4 w-4" />;
      case "setIncome":
        return <Wallet className="h-4 w-4" />;
      case "postPaid":
        return <TrendingDown className="h-4 w-4" />;
      case "history":
        return <History className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finanzas Personales
          </h1>
          <p className="text-gray-600">
            Gestiona tu dinero de manera inteligente
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Gestión Financiera
            </CardTitle>
            <CardDescription>
              Completa la información para gestionar tus finanzas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input de teléfono */}
              <div className="space-y-2">
                <Label htmlFor="phone">Número de teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Ej: +52 55 1234 5678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-lg"
                />
              </div>

              {/* Selector de opciones */}
              <div className="space-y-2">
                <Label htmlFor="option">¿Qué deseas hacer?</Label>
                <Select
                  value={selectedOption}
                  onValueChange={(value: OptionType) =>
                    setSelectedOption(value)
                  }
                >
                  <SelectTrigger className="text-lg">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balance">
                      <div className="flex items-center gap-2">
                        {getOptionIcon("balance")}
                        Obtener balance
                      </div>
                    </SelectItem>
                    <SelectItem value="payday">
                      <div className="flex items-center gap-2">
                        {getOptionIcon("payday")}
                        Avisar día de pago
                      </div>
                    </SelectItem>
                    <SelectItem value="setIncome">
                      <div className="flex items-center gap-2">
                        {getOptionIcon("setIncome")}
                        Definir salario
                      </div>
                    </SelectItem>
                    <SelectItem value="postPaid">
                      <div className="flex items-center gap-2">
                        {getOptionIcon("postPaid")}
                        Agregar gasto
                      </div>
                    </SelectItem>
                    <SelectItem value="history">
                      <div className="flex items-center gap-2">
                        {getOptionIcon("history")}
                        Ver historial de gastos
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Inputs dinámicos */}
              {renderFormInputs()}

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Recargar
                </Button>

                {selectedOption && (
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={!phoneNumber}
                  >
                    {selectedOption === "balance" && "Consultar Balance"}
                    {selectedOption === "payday" && "Configurar Recordatorio"}
                    {selectedOption === "setIncome" && "Guardar Salario"}
                    {selectedOption === "postPaid" && "Registrar Gasto"}
                    {selectedOption === "history" && "Actualizar Historial"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const defaultFormData = {
  salary: "",
  amount: "",
  description: "",
  category: "",
};
