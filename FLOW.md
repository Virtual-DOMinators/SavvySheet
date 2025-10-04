# SavvySheet - Applikationsflöde

Detta dokument beskriver det kompletta flödet i SavvySheet-applikationen med hjälp av Mermaid-diagram.

## Huvudflöde - Användarinteraktion

```mermaid
graph TB
    Start([Användaren besöker SavvySheet]) --> LoadApp[Ladda applikation]
    LoadApp --> CheckLocalStorage{localStorage<br/>har data?}
    
    CheckLocalStorage -->|Ja| RestoreData[Återställ data från localStorage]
    CheckLocalStorage -->|Nej| ShowHomePage[Visa HomePage]
    
    RestoreData --> NavigateToSheet[Navigera till /sheet]
    ShowHomePage --> UploadPrompt[Visa uppladdningsprompt]
    
    UploadPrompt --> UserAction{Användarens<br/>handling}
    UserAction -->|Dra fil| HandleDrop[Hantera drop-event]
    UserAction -->|Klicka| OpenFilePicker[Öppna filväljare]
    
    HandleDrop --> ValidateFile{Validera<br/>.xlsx?}
    OpenFilePicker --> SelectFile[Välj fil] --> ValidateFile
    
    ValidateFile -->|Nej| ShowError[Visa felmeddelande] --> UploadPrompt
    ValidateFile -->|Ja| ShowSpinner[Visa loading spinner]
    
    ShowSpinner --> ParseFile[Parsa Excel-fil med XLSX]
    ParseFile --> ExtractSheets[Extrahera alla sheets]
    ExtractSheets --> ConvertToJSON[Konvertera till JSON]
    
    ConvertToJSON --> UpdateState[Uppdatera AppRouter state]
    UpdateState --> SaveToLocalStorage[Spara till localStorage]
    SaveToLocalStorage --> NavigateToSheet
    
    NavigateToSheet --> RenderSheetPage[Rendera SheetPage]
    RenderSheetPage --> DisplayTable[Visa data i AG Grid]
    
    DisplayTable --> UserEdits{Användaren<br/>redigerar?}
    UserEdits -->|Ja| EditCell[Redigera cell]
    UserEdits -->|Nej| OtherActions{Annan<br/>handling?}
    
    EditCell --> SaveChanges[Spara ändringar]
    SaveChanges --> UpdateLocalStorage[Uppdatera localStorage]
    UpdateLocalStorage --> DisplayTable
    
    OtherActions -->|Export| ExportFlow[Gå till exportflöde]
    OtherActions -->|Ny fil| ShowHomePage
    OtherActions -->|Nästa sheet| NextSheet[Visa nästa sheet] --> DisplayTable
    OtherActions -->|Föregående sheet| PrevSheet[Visa föregående sheet] --> DisplayTable
```

## Komponenthierarki och Dataflöde

```mermaid
graph TB
    subgraph "React Component Tree"
        App[App - Error Boundary & Suspense]
        App --> AppRouter[AppRouter - Global State & Routing]
        
        AppRouter --> HomePage[HomePage - Landningssida]
        AppRouter --> SheetPage[SheetPage - Sheet-visning]
        
        HomePage --> UploadFile[UploadFile - Filuppladdning]
        HomePage --> BoxesContainer[BoxesContainer - Bakgrundsanimation]
        
        SheetPage --> Header[Header - Navigation]
        SheetPage --> SheetView[SheetView - Sheet-wrapper]
        SheetPage --> SheetNavigation[SheetNavigation - Sheet-navigering]
        
        Header --> DropDown[DropDown - Meny]
        DropDown --> ExportButton[ExportButton - Export-knappar]
        
        SheetView --> EditableTable[EditableTable - AG Grid]
    end
    
    subgraph "State Flow"
        GlobalState[Global State i AppRouter]
        GlobalState --> sheets[(sheets: SheetData)]
        GlobalState --> filename[(filename: string)]
        GlobalState --> columns[(columns: Columns)]
        GlobalState --> currentSheetIdx[(currentSheetIdx: number)]
    end
    
    subgraph "Hooks & Utils"
        useLocalSheet[useLocalSheet - localStorage sync]
        useSheetColumns[useSheetColumns - Kolumn-generering]
        parseExcelFile[parseExcelFile - Excel-parsing]
        generatePDF[generatePDF - PDF-export]
        getColumnDefs[getColumnDefs - Kolumndefinitioner]
    end
    
    GlobalState -.->|använder| useLocalSheet
    GlobalState -.->|använder| useSheetColumns
    UploadFile -.->|använder| parseExcelFile
    ExportButton -.->|använder| generatePDF
    EditableTable -.->|använder| getColumnDefs
```

## Filuppladdningsflöde (Detaljerat)

```mermaid
sequenceDiagram
    participant User as Användare
    participant UploadFile as UploadFile Component
    participant FileReader as Browser FileReader
    participant XLSX as XLSX Library
    participant HomePage as HomePage Component
    participant AppRouter as AppRouter
    participant LocalStorage as localStorage
    participant Navigator as React Router
    
    User->>UploadFile: Drar/väljer .xlsx-fil
    UploadFile->>UploadFile: Validera filtyp (.xlsx)
    
    alt Ogiltig fil
        UploadFile->>User: Visa alert: "Endast .xlsx-filer stöds"
    else Giltig fil
        UploadFile->>UploadFile: Sätt loading=true (visa spinner)
        UploadFile->>FileReader: readAsArrayBuffer(file)
        FileReader->>XLSX: XLSX.read(arrayBuffer)
        
        loop För varje sheet i workbook
            XLSX->>XLSX: XLSX.utils.sheet_to_json(sheet)
        end
        
        XLSX->>UploadFile: Returnera parsed data
        UploadFile->>HomePage: onDataParsed(sheetsData, fileName)
        HomePage->>AppRouter: handleDataParsed(sheetsData, fileName)
        
        AppRouter->>AppRouter: setSheets(sheetsData)
        AppRouter->>AppRouter: setFilename(fileName)
        AppRouter->>AppRouter: setCurrentSheetIdx(0)
        
        AppRouter->>LocalStorage: useLocalSheet sparar automatiskt
        LocalStorage-->>AppRouter: Data sparad
        
        HomePage->>Navigator: navigate('/sheet')
        Navigator->>SheetPage: Rendera SheetPage
        SheetPage->>User: Visa data i tabell
    end
```

## Data-redigeringsflöde (AG Grid)

```mermaid
sequenceDiagram
    participant User as Användare
    participant AGGrid as AG Grid (EditableTable)
    participant EditableTable as EditableTable Component
    participant SheetView as SheetView
    participant SheetPage as SheetPage
    participant AppRouter as AppRouter
    participant useLocalSheet as useLocalSheet Hook
    participant LocalStorage as localStorage
    
    User->>AGGrid: Dubbelklickar på cell
    AGGrid->>AGGrid: Aktivera edit-mode
    User->>AGGrid: Redigerar värde
    User->>AGGrid: Tryck Enter/Tab eller klicka bort
    
    AGGrid->>EditableTable: onCellValueChanged event
    EditableTable->>EditableTable: gridApi.stopEditing()
    EditableTable->>EditableTable: gridApi.forEachNode() - samla all data
    
    loop För varje rad
        EditableTable->>EditableTable: Type-check och formattera cell-värden
    end
    
    EditableTable->>EditableTable: isEqual(newData, lastSavedData)
    
    alt Data har ändrats
        EditableTable->>EditableTable: Uppdatera lastSavedDataRef
        EditableTable->>SheetView: dataOnChange(newData)
        SheetView->>SheetPage: onDataChange(newData)
        
        SheetPage->>SheetPage: setSheets(prev => {...prev, [sheetName]: newData})
        SheetPage->>AppRouter: State uppdaterad via prop
        
        AppRouter->>useLocalSheet: sheets state ändrad (trigger effect)
        useLocalSheet->>useLocalSheet: Debounce 200ms
        useLocalSheet->>LocalStorage: localStorage.setItem('savvySheetData', JSON.stringify(sheets))
        LocalStorage-->>User: Data sparad (persistent)
    else Data oförändrad
        EditableTable->>EditableTable: Skippa callback (optimering)
    end
```

## PDF-exportflöde

```mermaid
sequenceDiagram
    participant User as Användare
    participant DropDown as DropDown Component
    participant ExportButton as ExportButton
    participant generatePDF as generatePDF Utility
    participant jsPDF as jsPDF Library
    participant autoTable as autoTable Plugin
    participant Browser as Webbläsare
    
    User->>DropDown: Klickar "Meny"
    DropDown->>DropDown: Sätt open=true
    DropDown->>User: Visa dropdown-meny
    
    User->>ExportButton: Klickar "Ladda ner PDF" eller "Visa PDF"
    
    alt Ladda ner PDF
        ExportButton->>DropDown: onDownload()
        DropDown->>generatePDF: generatePDF(data, columns)
    else Visa PDF
        ExportButton->>DropDown: onShow()
        DropDown->>generatePDF: generatePDF(data, columns)
    end
    
    generatePDF->>generatePDF: Gruppera data per sheet
    
    loop För varje sheet
        generatePDF->>jsPDF: doc.addPage() (om ej första)
        generatePDF->>jsPDF: doc.text(sheetName, x, y)
        generatePDF->>generatePDF: Extrahera kolumnnamn
        generatePDF->>generatePDF: Formattera rad-data
        generatePDF->>autoTable: autoTable(doc, {head, body, startY})
        autoTable->>jsPDF: Rita tabell på PDF
    end
    
    generatePDF-->>DropDown: Returnera jsPDF instance
    
    alt Ladda ner
        DropDown->>jsPDF: doc.save(filename)
        jsPDF->>Browser: Trigga file download
        Browser->>User: Spara fil till disk
    else Visa
        DropDown->>jsPDF: doc.output('bloburl')
        jsPDF->>DropDown: Returnera blob URL
        DropDown->>Browser: window.open(blobUrl, '_blank')
        Browser->>User: Öppna PDF i ny flik
    end
    
    DropDown->>DropDown: Sätt open=false (stäng meny)
```

## localStorage Persistens-flöde

```mermaid
graph TB
    subgraph "Initial Load - useLocalSheet Effect 1"
        Mount[Component Mount] --> LoadEffect[Load Effect körs]
        LoadEffect --> GetItem[localStorage.getItem('savvySheetData')]
        GetItem --> HasData{Data finns?}
        
        HasData -->|Ja| ParseJSON[JSON.parse(data)]
        HasData -->|Nej| SetLoaded1[hasLoaded.current = true]
        
        ParseJSON --> ValidJSON{Giltig JSON?}
        ValidJSON -->|Ja| SetState1[setSheetData(parsed)]
        ValidJSON -->|Nej| LogError[console.error] --> SetLoaded1
        
        SetState1 --> LoadFilename[Ladda filnamn]
        LoadFilename --> SetLoaded1
        SetLoaded1 --> StateReady[State redo för app]
    end
    
    subgraph "Data Change - useLocalSheet Effect 2"
        DataChange[sheets eller filename ändras] --> CheckLoaded{hasLoaded?}
        CheckLoaded -->|Nej| Skip1[Skippa - första load]
        CheckLoaded -->|Ja| CheckEmpty{Data tom?}
        
        CheckEmpty -->|Ja| Skip2[Skippa - ingen data att spara]
        CheckEmpty -->|Nej| SetTimeout[setTimeout 200ms]
        
        SetTimeout --> Debounce{200ms gått?}
        Debounce -->|Ny ändring| ClearTimeout[clearTimeout] --> SetTimeout
        Debounce -->|Ja| SaveFunction[save function]
        
        SaveFunction --> Stringify[JSON.stringify(sheetData)]
        Stringify --> SetItem[localStorage.setItem]
        SetItem --> SaveFilename{Filnamn finns?}
        
        SaveFilename -->|Ja| SetFilenameItem[localStorage.setItem(filename)]
        SaveFilename -->|Nej| Done[Sparning klar]
        SetFilenameItem --> Done
    end
    
    StateReady -.->|Användaren gör ändringar| DataChange
```

## Routing och Navigation

```mermaid
graph LR
    subgraph "Routes"
        Root[/ - HomePage]
        Sheet[/sheet - SheetPage]
    end
    
    subgraph "Navigation Triggers"
        FileUpload[Fil uppladdad] -->|navigate to| Sheet
        NewFileBtn[Ny fil-knapp] -->|navigate to| Root
        DirectURL[Direkt URL] -->|load| RouteMatch{Matcha route}
        LocalStorageData[localStorage data finns] -->|auto| Sheet
    end
    
    RouteMatch -->|/| Root
    RouteMatch -->|/sheet| Sheet
    RouteMatch -->|Okänd| Root
    
    subgraph "GitHub Pages Fix"
        NotFound[404 från GitHub Pages] --> SavePath[Spara path i sessionStorage]
        SavePath --> RedirectIndex[Redirect till index.html]
        RedirectIndex --> ScriptRun[Script i index.html]
        ScriptRun --> RestorePath[Återställ path med History API]
        RestorePath --> ReactRouter[React Router tar över]
    end
```

## Komponent Lifecycle och Lazy Loading

```mermaid
graph TB
    subgraph "App Bootstrap"
        PageLoad[Browser laddar index.html] --> ScriptLoad[main.tsx körs]
        ScriptLoad --> CreateRoot[createRoot på #root]
        CreateRoot --> RenderApp[Rendera App i StrictMode]
    end
    
    subgraph "App Component"
        RenderApp --> ErrorBoundary[ErrorBoundary wrapper]
        ErrorBoundary --> Suspense1[Suspense med Spinner]
        Suspense1 --> LazyAppRouter{AppRouter lazy?}
        
        LazyAppRouter -->|Ej laddad| ShowSpinner1[Visa Spinner]
        LazyAppRouter -->|Laddad| RenderAppRouter[Rendera AppRouter]
        
        ShowSpinner1 --> ImportAppRouter[Dynamic import AppRouter]
        ImportAppRouter --> RenderAppRouter
    end
    
    subgraph "Page Components"
        RenderAppRouter --> RouteMatch{Route match?}
        
        RouteMatch -->|/| HomePage[Rendera HomePage]
        RouteMatch -->|/sheet| SheetPage[Rendera SheetPage]
        
        SheetPage --> Suspense2[Suspense för lazy components]
        Suspense2 --> LazyHeader{Header lazy?}
        Suspense2 --> LazySheetView{SheetView lazy?}
        Suspense2 --> LazyNavigation{SheetNavigation lazy?}
        
        LazyHeader -->|Ej laddad| LoadHeader[Dynamic import Header]
        LazySheetView -->|Ej laddad| LoadSheetView[Dynamic import SheetView]
        LazyNavigation -->|Ej laddad| LoadNavigation[Dynamic import SheetNavigation]
        
        LoadHeader --> RenderHeader[Rendera Header]
        LoadSheetView --> RenderSheetView[Rendera SheetView]
        LoadNavigation --> RenderNavigation[Rendera SheetNavigation]
    end
```

## Prestanda och Optimeringar

```mermaid
graph TB
    subgraph "Code Splitting"
        Bundle[Main Bundle] --> CoreCode[Core Code - App, AppRouter]
        Bundle --> LazyRoute[Lazy Routes - HomePage, SheetPage]
        Bundle --> LazyComponents[Lazy Components - Header, SheetView, etc.]
        Bundle --> LazyUtils[Lazy Utils - parseExcelFile dynamisk import]
        Bundle --> LazyBackgrounds[Lazy Backgrounds - BoxesContainer]
    end
    
    subgraph "Memoization"
        SheetPageMemo[SheetPage] --> UseMemoSheetNames[useMemo för sheetNames]
        SheetPageMemo --> UseMemoFlatColumns[useMemo för flatColumns]
        
        UseSheetColumns[useSheetColumns] --> UseMemoColumns[useMemo för columns]
        
        EditableTable[EditableTable] --> UseCallbackSave[useCallback för saveData]
        
        BoxesContainer[BoxesContainer] --> MemoBox[memo() för Box-komponenter]
    end
    
    subgraph "localStorage Optimering"
        DataChange[Data ändras] --> Debounce[200ms debounce]
        Debounce --> SingleWrite[En write operation]
        Debounce -.->|Utan debounce| MultipleWrites[Många writes]
    end
    
    subgraph "AG Grid Optimering"
        LargeDataset[Stor dataset] --> Virtualization[AG Grid virtualisering]
        Virtualization --> OnlyVisible[Rendera endast synliga rader]
        OnlyVisible --> FastScroll[Snabb scrolling]
        
        CellEdit[Cell-redigering] --> StopEditing[stopEditing innan save]
        StopEditing --> ForEachNode[forEachNode för data]
        ForEachNode --> IsEqual[isEqual check]
        IsEqual -->|Oförändrad| SkipCallback[Skippa callback]
        IsEqual -->|Ändrad| TriggerCallback[Trigga callback]
    end
```

Detta flödesdiagram ger en komplett översikt av hur SavvySheet fungerar från initial laddning till export och persistens.
