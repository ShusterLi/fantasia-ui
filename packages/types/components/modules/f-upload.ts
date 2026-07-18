type imageType = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/jpg' | 'image/bmp' | 'image/gif' | 'image/svg+xml' | 'image/svg';
type fileType = imageType;
type fileTypes = 'image';
type fileTypesMap = {
	[key in fileTypes]: fileType[];
};

interface SheetData {
	sheetName: string;
	data: any[];
}

// interface ChunkInfo {
//   index: number;
//   totalChunks: number;
//   start: number;
//   end: number;
//   size: number;
//   uniqueId: string;
//   content: string;
// }

export type { fileTypesMap, SheetData, imageType };
