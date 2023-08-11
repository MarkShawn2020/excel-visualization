import { toast } from "@/components/ui/use-toast";
import { read, WorkBook } from "xlsx";
import { useStore } from "@/store";

import localSampleData from "@/data/sheets/sample.xlsx";

const useHandleWorkbook = () => {
  const { setWs, setSheetName } = useStore();

  const f = (wb: WorkBook) => {
    console.log("read workbook: ", wb);
    if (!wb)
      return toast({
        description: "未检测到合法的 WorkBook",
        variant: "destructive",
      });

    const worksheetName = wb.SheetNames[0];
    console.log("read worksheet: ", worksheetName);
    if (!worksheetName)
      return toast({
        description: "未检测到合法的 WorkSheet",
        variant: "destructive",
      });
    setSheetName(worksheetName);
    setWs(wb.Sheets[worksheetName]);
  };
  return f;
};

export const useReadLocalXlsx = () => {
  const handleWorkbook = useHandleWorkbook();

  return () => {
    handleWorkbook(read(localSampleData, { type: "base64" }));
  };
};

export const useReadUserXlsx = () => {
  const handleWorkbook = useHandleWorkbook();

  return (filePath: string, blob: Blob) => {
    if (!filePath)
      return toast({ description: "未检测到文件", variant: "destructive" });

    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);

    reader.onload = (event) => {
      const data = event.target?.result;
      console.log("read file data: ", data);
      if (!data)
        return toast({ description: "未检测到数据", variant: "destructive" });

      const workbook: WorkBook = read(data, { type: "array" });
      handleWorkbook(workbook);
    };
  };
};
