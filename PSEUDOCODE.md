# SavvySheet - Pseudokod för hela applikationen

Detta dokument beskriver hela applikationens logik i pseudokod-format. Syftet är att ge en översikt av flödet och strukturen utan att fokusera på implementationsdetaljer.

## 1. Applikationsstart (main.tsx)

```pseudocode
FUNCTION startApplikation():
    // Hitta root-element i DOM
    container = document.getElementById('root')
    
    IF container INTE existerar:
        KASTA FEL "Root element not found"
    END IF
    
    // Skapa React root
    root = createRoot(container)
    
    // Rendera applikationen i StrictMode
    root.render(
        <StrictMode>
            <App />
        </StrictMode>
    )
END FUNCTION
```

## 2. Huvudkomponent (App.tsx)

```pseudocode
COMPONENT App:
    // Lazy load AppRouter för bättre prestanda
    AppRouter = lazy(() => import('./AppRouter'))
    
    FUNCTION renderError(error, resetErrorBoundary):
        VISA felmeddelande
        VISA error.message
        VISA "Try again" knapp som kallar resetErrorBoundary
    END FUNCTION
    
    RETURNERA:
        <ErrorBoundary fallback={renderError}>
            <Suspense fallback={<Spinner />}>
                <AppRouter />
            </Suspense>
        </ErrorBoundary>
    END RETURNERA
END COMPONENT
```

## 3. Routing och State Management (AppRouter.tsx)

```pseudocode
COMPONENT AppRouter:
    // Global state
    sheets = STATE(tomt objekt)  // { sheetName: [rader...] }
    filename = STATE(undefined)
    currentSheetIdx = STATE(0)
    
    // Custom hooks
    ANROPA useLocalSheet(sheets, setSheets, filename, setFilename)
    columns = ANROPA useSheetColumns(sheets)
    
    FUNCTION handleDataParsed(parsedSheets, fileName):
        setSheets(parsedSheets)
        setFilename(fileName)
        setCurrentSheetIdx(0)
    END FUNCTION
    
    RETURNERA:
        <BrowserRouter basename="/SavvySheet">
            <Routes>
                <Route path="/" element={
                    <HomePage onDataParsed={handleDataParsed} />
                } />
                <Route path="/sheet" element={
                    <SheetPage 
                        sheets={sheets}
                        columns={columns}
                        filename={filename}
                        currentSheetIdx={currentSheetIdx}
                        setSheets={setSheets}
                        setCurrentSheetIdx={setCurrentSheetIdx}
                    />
                } />
            </Routes>
        </BrowserRouter>
    END RETURNERA
END COMPONENT
```

## 4. Landningssida (HomePage.tsx)

```pseudocode
COMPONENT HomePage(onDataParsed):
    navigate = ANVÄND React Router navigate
    showBoxes = STATE(false)
    
    // Lazy load BoxesContainer efter 500ms
    BoxesContainer = lazy(() => import('BoxesContainer'))
    
    VID MOUNT:
        timeout = setTimeout(() => setShowBoxes(true), 500)
        VID UNMOUNT:
            clearTimeout(timeout)
        END VID
    END VID
    
    FUNCTION handleDataParsed(parsedSheets, fileName):
        onDataParsed(parsedSheets, fileName)
        navigate('/sheet')
    END FUNCTION
    
    RETURNERA:
        <div med dark bakgrund och animationer>
            // Bakgrundsoverlay med fade-in
            <motion.div med opacity animation />
            
            // Animerad bakgrund (om showBoxes är true)
            OM showBoxes:
                <Suspense>
                    <BoxesContainer />
                </Suspense>
            END OM
            
            // Huvudinnehåll
            <div centrerat innehåll>
                // Animerad titel
                <motion.div med fade-in från toppen>
                    <h1 med neon-effekt>"SavvySheet"</h1>
                </motion.div>
                
                // Upload-komponent med zoom-in animation
                <motion.div med zoom-in från botten>
                    <UploadFile onDataParsed={handleDataParsed} />
                </motion.div>
            </div>
        </div>
    END RETURNERA
END COMPONENT
```

## 5. Filuppladdning (UploadFile.tsx)

```pseudocode
COMPONENT UploadFile(onDataParsed):
    fileInputRef = REF(null)
    loading = STATE(false)
    isDragging = STATE(false)
    navigate = ANVÄND React Router navigate
    
    FUNKTION handleFile(file):
        // Validering
        OM INTE file.name slutar med '.xlsx':
            alert("Endast .xlsx-filer stöds")
            RETURNERA
        END OM
        
        setLoading(true)
        
        FÖRSÖK:
            // Dynamisk import för code splitting
            parseExcelFile = IMPORTERA från 'utils/uploadUtils'
            
            // Parsa filen
            VÄNTA parseExcelFile(file, onDataParsed)
            
            // Navigera till sheet-sidan
            navigate('/sheet')
        FÅNGA error:
            console.error(error)
            alert("Kunde inte läsa filen")
        SLUTLIGEN:
            setLoading(false)
        END FÖRSÖK
    END FUNKTION
    
    FUNKTION handleFileChange(event):
        file = event.target.files[0]
        OM file existerar:
            handleFile(file)
        END OM
    END FUNKTION
    
    FUNKTION handleDrop(event):
        event.preventDefault()
        setIsDragging(false)
        file = event.dataTransfer.files[0]
        OM file existerar:
            handleFile(file)
        END OM
    END FUNKTION
    
    FUNKTION handleDragOver(event):
        event.preventDefault()
        setIsDragging(true)
    END FUNKTION
    
    FUNKTION handleDragLeave():
        setIsDragging(false)
    END FUNKTION
    
    RETURNERA:
        <div upload-område>
            <div klickbart och draggable område
                onClick={() => fileInputRef.current.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={isDragging ? animerad gradient : normal}>
                
                OM loading:
                    <Spinner />
                ANNARS:
                    <p>
                        {isDragging ? "Släpp filen här" : "Importera en .xlsx-fil"}
                    </p>
                END OM
            </div>
            
            <input typ="file" 
                ref={fileInputRef}
                accept=".xlsx"
                onChange={handleFileChange}
                dold />
        </div>
    END RETURNERA
END COMPONENT
```

## 6. Excel-parsing (uploadUtils.ts)

```pseudocode
FUNKTION parseExcelFile(file, onDataParsed):
    reader = NY FileReader()
    
    reader.onload = FUNKTION(event):
        // Konvertera till Uint8Array
        data = NY Uint8Array(event.target.result)
        
        // Parsa med XLSX library
        workbook = XLSX.read(data, { type: 'array' })
        
        allSheets = tomt objekt
        
        FÖR VARJE sheetName I workbook.SheetNames:
            worksheet = workbook.Sheets[sheetName]
            
            // Konvertera till JSON
            jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' })
            
            allSheets[sheetName] = jsonData
        END FÖR
        
        // Anropa callback med parsed data
        onDataParsed(allSheets, file.name)
    END FUNKTION
    
    // Starta läsning
    reader.readAsArrayBuffer(file)
END FUNKTION
```

## 7. Sheet-sida (SheetPage.tsx)

```pseudocode
COMPONENT SheetPage(sheets, columns, filename, currentSheetIdx, setSheets, setCurrentSheetIdx, setFilename):
    // Lazy load komponenter
    Header = lazy(() => import('Header'))
    SheetView = lazy(() => import('SheetView'))
    SheetNavigation = lazy(() => import('SheetNavigation'))
    
    // Synkronisera med localStorage
    ANROPA useLocalSheet(sheets, setSheets, filename, setFilename)
    
    // Memoized beräkningar
    sheetNames = MEMOIZED Object.keys(sheets)
    flatColumns = MEMOIZED Object.values(columns).flat()
    
    FUNKTION handleNext():
        setCurrentSheetIdx(MIN(currentSheetIdx + 1, sheetNames.length - 1))
    END FUNKTION
    
    FUNKTION handlePrev():
        setCurrentSheetIdx(MAX(currentSheetIdx - 1, 0))
    END FUNKTION
    
    // Early return om ingen data
    OM sheetNames.length === 0:
        RETURNERA:
            <Suspense>
                <Header ... />
                <div>"Ingen fil uppladdad ännu"</div>
            </Suspense>
        END RETURNERA
    END OM
    
    RETURNERA:
        <motion.div med fade-in animation>
            <Suspense fallback={<Spinner />}>
                <Header sheets={sheets} columns={flatColumns} filename={filename} />
                
                <div container>
                    <SheetView
                        sheetName={sheetNames[currentSheetIdx]}
                        data={sheets[sheetNames[currentSheetIdx]]}
                        columns={columns[sheetNames[currentSheetIdx]]}
                        onDataChange={(newData) => {
                            setSheets(prev => ({
                                ...prev,
                                [sheetNames[currentSheetIdx]]: newData
                            }))
                        }}
                    />
                    
                    OM sheetNames.length > 1:
                        <SheetNavigation
                            currentIdx={currentSheetIdx}
                            maxIdx={sheetNames.length - 1}
                            onPrev={handlePrev}
                            onNext={handleNext}
                        />
                    END OM
                </div>
            </Suspense>
        </motion.div>
    END RETURNERA
END COMPONENT
```

## 8. Redigerbar tabell (EditableTable.tsx)

```pseudocode
COMPONENT EditableTable(data, dataOnChange):
    gridApiRef = REF(null)
    lastSavedDataRef = REF(data)
    
    // Generera kolumndefinitioner
    colDefs = getColumnDefs(data)
    
    FUNKTION saveData():
        OM INTE gridApiRef.current:
            RETURNERA
        END OM
        
        // Stoppa pågående redigering
        gridApiRef.current.stopEditing()
        
        updatedData = tom array
        
        // Samla all data från grid
        gridApiRef.current.forEachNode((node) => {
            row = tomt objekt
            
            FÖR VARJE [key, value] I node.data:
                OM value är string, number, boolean, eller null:
                    row[key] = value
                ANNARS:
                    row[key] = String(value)
                END OM
            END FÖR
            
            updatedData.push(row)
        })
        
        // Jämför med senast sparade data
        OM INTE isEqual(updatedData, lastSavedDataRef.current):
            lastSavedDataRef.current = updatedData
            dataOnChange(updatedData)
        END OM
    END FUNKTION
    
    OM data.length === 0:
        RETURNERA:
            <div tom state>"Ingen fil uppladdad än!"</div>
        END RETURNERA
    END OM
    
    RETURNERA:
        <div onMouseLeave={saveData}>
            <div AG Grid theme>
                <AgGridReact
                    rowData={data}
                    columnDefs={colDefs}
                    onGridReady={(params) => {
                        gridApiRef.current = params.api
                    }}
                    onCellValueChanged={saveData}
                />
            </div>
        </div>
    END RETURNERA
END COMPONENT
```

## 9. localStorage Persistens (useLocalSheet.ts)

```pseudocode
HOOK useLocalSheet(sheetData, setSheetData, filename, setFilename, key, filenameKey):
    hasLoaded = REF(false)
    
    // Effect 1: Ladda från localStorage vid mount
    VID MOUNT:
        saved = localStorage.getItem(key)
        
        OM saved existerar:
            FÖRSÖK:
                parsed = JSON.parse(saved)
                setSheetData(parsed)
            FÅNGA error:
                console.error("Failed to parse saved sheets")
            END FÖRSÖK
        END OM
        
        OM setFilename existerar:
            savedFilename = localStorage.getItem(filenameKey)
            OM savedFilename existerar:
                setFilename(savedFilename)
            END OM
        END OM
        
        hasLoaded.current = true
    END VID
    
    // Effect 2: Spara till localStorage vid ändringar
    VID ÄNDRING AV sheetData ELLER filename:
        OM INTE hasLoaded.current:
            RETURNERA  // Första load, skippa save
        END OM
        
        isEmpty = (
            (sheetData är array OCH length === 0) ELLER
            (sheetData är objekt OCH keys.length === 0)
        )
        
        OM isEmpty:
            RETURNERA  // Skippa save av tom data
        END OM
        
        FUNKTION save():
            localStorage.setItem(key, JSON.stringify(sheetData))
            OM filename existerar:
                localStorage.setItem(filenameKey, filename)
            END OM
        END FUNKTION
        
        // Debounce med 200ms
        timeout = setTimeout(save, 200)
        
        VID CLEANUP:
            clearTimeout(timeout)
        END VID
    END VID
END HOOK
```

## 10. Kolumn-generering (useSheetColumns.ts)

```pseudocode
HOOK useSheetColumns(sheets):
    columns = MEMOIZED:
        newColumns = tomt objekt
        
        FÖR VARJE [sheetName, data] I sheets:
            newColumns[sheetName] = getColumnDefs(data)
        END FÖR
        
        RETURNERA newColumns
    END MEMOIZED
    
    RETURNERA columns
END HOOK
```

## 11. Kolumndefinitioner (tableUtils.ts)

```pseudocode
FUNKTION getColumnDefs(data):
    OM data är null ELLER data.length === 0:
        RETURNERA tom array
    END OM
    
    columns = tom array
    
    FÖR VARJE key I Object.keys(data[0]):
        columns.push({
            field: key,
            editable: true,
            flex: 1,
            sortable: true,
            filter: true
        })
    END FÖR
    
    RETURNERA columns
END FUNKTION

FUNKTION isEqual(a, b):
    RETURNERA JSON.stringify(a) === JSON.stringify(b)
END FUNKTION
```

## 12. Header och Dropdown (Header.tsx & DropDown.tsx)

```pseudocode
COMPONENT Header(sheets, columns, filename):
    navigate = ANVÄND React Router navigate
    hasData = Object.keys(sheets).length > 0
    
    FUNKTION handleNewFile():
        navigate('/')
    END FUNKTION
    
    RETURNERA:
        <header>
            <div vänster sida>
                <img logo />
                <h1>"SavvySheet"</h1>
            </div>
            <div höger sida>
                OM hasData:
                    <DropDown 
                        sheets={sheets}
                        columns={columns}
                        filename={filename}
                        onUploadNewFile={handleNewFile}
                    />
                END OM
            </div>
        </header>
    END RETURNERA
END COMPONENT

COMPONENT DropDown(sheets, columns, filename, onUploadNewFile):
    open = STATE(false)
    
    OM INTE sheets ELLER sheets är tomt:
        RETURNERA null
    END OM
    
    sheetNames = Object.keys(sheets)
    
    // Transformera data för PDF
    data = sheetNames.flatMap((sheetName) =>
        sheets[sheetName].map((row) => ({ 
            SheetName: sheetName, 
            ...row 
        }))
    )
    
    pdfFilename = getPdfFilename(filename)
    
    FUNKTION handleDownload():
        doc = generatePDF(data, columns)
        doc.save(pdfFilename)
        setOpen(false)
    END FUNKTION
    
    FUNKTION handleShow():
        doc = generatePDF(data, columns)
        window.open(doc.output('bloburl'), '_blank')
        setOpen(false)
    END FUNKTION
    
    FUNKTION handleUploadNewFile():
        onUploadNewFile()
        setOpen(false)
    END FUNKTION
    
    RETURNERA:
        <div dropdown container>
            <button onClick={() => setOpen(!open)}>
                "Meny" <ChevronIcon />
            </button>
            
            OM open:
                <div dropdown meny>
                    <ExportButton 
                        data={data}
                        columns={columns}
                        onDownload={handleDownload}
                        onShow={handleShow}
                    />
                    <button onClick={handleUploadNewFile}>
                        "Ladda upp ny fil"
                    </button>
                </div>
            END OM
        </div>
    END RETURNERA
END COMPONENT
```

## 13. PDF-export (exportUtils.ts)

```pseudocode
FUNKTION getPdfFilename(originalFileName):
    OM INTE originalFileName:
        RETURNERA "table-savvysheet.pdf"
    END OM
    
    dotIndex = originalFileName.lastIndexOf('.')
    basename = dotIndex > 0 
        ? originalFileName.substring(0, dotIndex) 
        : originalFileName
    
    RETURNERA basename + "-savvysheet.pdf"
END FUNKTION

FUNKTION generatePDF(data, columns):
    doc = NY jsPDF()
    
    // Gruppera data per sheet
    grouped = tomt objekt
    FÖR VARJE row I data:
        sheet = row.SheetName ELLER 'Sheet'
        OM INTE grouped[sheet]:
            grouped[sheet] = tom array
        END OM
        grouped[sheet].push(row)
    END FÖR
    
    first = true
    
    FÖR VARJE [sheet, rows] I grouped:
        // Lägg till ny sida (utom första)
        OM INTE first:
            doc.addPage()
        END OM
        first = false
        
        // Skriv sheet-namn som rubrik
        doc.setFontSize(14)
        doc.text(sheet, 14, 20)
        
        // Extrahera kolumnnamn
        sheetCols = Object.keys(rows[0] ELLER {}).filter(k => k !== 'SheetName')
        
        // Skapa table header
        head = [sheetCols]
        
        // Formattera table body
        body = rows.map((row) =>
            sheetCols.map((col) => {
                value = row[col]
                
                OM value är boolean:
                    RETURNERA value ? 'Yes' : 'No'
                ANNARS OM value är number ELLER string:
                    RETURNERA value
                ANNARS OM value är null ELLER undefined:
                    RETURNERA ''
                ANNARS:
                    RETURNERA String(value)
                END OM
            })
        )
        
        // Skapa tabell med autoTable
        autoTable(doc, { 
            head: head, 
            body: body, 
            startY: 30 
        })
    END FÖR
    
    RETURNERA doc
END FUNKTION
```

## 14. Navigering mellan sheets (SheetNavigation.tsx)

```pseudocode
COMPONENT SheetNavigation(currentIdx, maxIdx, onPrev, onNext):
    RETURNERA:
        <div centrerad container>
            <button 
                onClick={onPrev}
                disabled={currentIdx === 0}>
                "Föregående"
            </button>
            <button 
                onClick={onNext}
                disabled={currentIdx === maxIdx}>
                "Nästa"
            </button>
        </div>
    END RETURNERA
END COMPONENT
```

## 15. Bakgrundsanimation (BoxesContainer.tsx)

```pseudocode
COMPONENT BoxesContainer():
    rows = 12
    cols = 20
    totalBoxes = rows * cols
    
    activeBox = STATE(null)
    
    VID MOUNT:
        interval = setInterval(() => {
            randomIndex = Math.floor(Math.random() * totalBoxes)
            setActiveBox(randomIndex)
        }, 2000)
        
        VID UNMOUNT:
            clearInterval(interval)
        END VID
    END VID
    
    RETURNERA:
        <div absolut fullscreen container>
            FÖR i FRÅN 0 TILL rows:
                <div rad container>
                    FÖR j FRÅN 0 TILL cols:
                        index = i * cols + j
                        <Box active={index === activeBox} />
                    END FÖR
                </div>
            END FÖR
        </div>
    END RETURNERA
END COMPONENT

COMPONENT Box(active) MED memo:
    RETURNERA:
        <div 
            backgroundColor={active ? '#ffffff' : '#0f172a'}
            opacity={active ? 0.14 : 0.15}
            med smooth transition
        />
    END RETURNERA
END COMPONENT
```

## 16. Loading Spinner (Spinner.tsx)

```pseudocode
COMPONENT Spinner():
    RETURNERA:
        <div fullscreen overlay>
            <div spinner container>
                // Yttre ring - långsam rotation medurs
                <div 
                    cyan/pink border
                    animate-spin-slow
                />
                // Inre ring - snabbare rotation moturs  
                <div 
                    purple/green border
                    animate-spin-reverse
                />
            </div>
        </div>
    END RETURNERA
END COMPONENT
```

## Sammanfattning av Dataflödet

```pseudocode
DATAFLÖDE:
    1. ANVÄNDARINTERAKTION:
       Användare -> UploadFile -> FileReader -> XLSX library
    
    2. DATA PARSING:
       XLSX library -> parseExcelFile -> SheetData objekt
    
    3. STATE UPDATE:
       SheetData -> AppRouter.setSheets -> useLocalSheet
    
    4. PERSISTENS:
       useLocalSheet -> localStorage.setItem (debounced 200ms)
    
    5. RENDERING:
       AppRouter -> SheetPage -> SheetView -> EditableTable -> AG Grid
    
    6. REDIGERING:
       AG Grid -> onCellValueChanged -> saveData -> dataOnChange callback
       -> SheetPage.setSheets -> useLocalSheet -> localStorage
    
    7. EXPORT:
       DropDown -> generatePDF -> jsPDF -> autoTable -> PDF file
    
    8. NAVIGATION:
       React Router -> match route -> render HomePage eller SheetPage
```

Detta pseudokod-dokument ger en komplett översikt av hela applikationens logik och struktur.
