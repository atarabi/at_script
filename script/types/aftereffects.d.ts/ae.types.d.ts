/** Clears text from the Info panel. */
declare var clearOutput: () => void;

/** Converts string time value to a numeric time value. */
declare var currentFormatToTime: (formattedTime: string, fps: number, isDuration?: boolean) => number;

/** Converts a numeric time value to a string time value. */
declare var timeToCurrentFormat: (time: number, fps: number, isDuration?: boolean) => string;

/** Writes text to the Info panel, with no line break added. */
declare var write: (text: string) => void;

/** Writes text to the Info panel, adding a line break at the end. */
declare var writeLn: (text: string) => void;

/** When true, the specified object exists. */
declare var isValid: (obj: Object) => boolean;

/** 24.0- Returns the string value of an Enum. */
declare var getEnumAsString: (Enum: number) => string;

/** Provides access to objects and application settings within the After Effects application. The single global object is always available by its name, app. */
declare class Application {
  /** The current After Effects project. */
  readonly project: Project;

  /** The locale (language and region) in which the application is running. */
  readonly isoLanguage: string;

  /** The version number of the After Effects application. */
  readonly version: string;

  /** The name of this build of the application. */
  readonly buildName: string;

  /** The number of this build of the application. */
  readonly buildNumber: number;

  /** When true, the local application is running in Watch Folder mode. */
  readonly isWatchFolder: boolean;

  /** When true, the local After Effects application is running as a render engine. */
  readonly isRenderEngine: boolean;

  /** The language After Effects is running. */
  readonly language: Language;

  /** Application settings that can be set via scripting. */
  readonly settings: Settings;

  /** A callback function that is called when an error occurs in the application. */
  onError: string | null;

	/** A numeric status code used when executing a script
		externally (that is, from a command line or AppleScript).
		0 if no error occurred. A positive number indicates an
		error that occurred while running the script. */
  exitCode: number;

  /** When true, the application remains open after running a script from the command line on Windows. */
  exitAfterLaunchAndEval: boolean;

  /** When true, the project is saved if the application closes unexpectedly. */
  saveProjectOnCrash: boolean;

  /** Memory in use by this application. */
  readonly memoryInUse: number;

  /** The effects available in the application. */
  readonly effects: { displayName: string, matchName: string, version: string, category: string }[];

  /** The currently focused or last-focused viewer panel. */
  readonly activeViewer: Viewer | null;

  // Preferences
  readonly preferences: Preferences;

  /** CC2017- */
  availableGPUAccelTypes: GpuAccelType[];

  /** 24.0- Returns an object to navigate and retreive all the fonts currently available on your system. */
  readonly fonts: Fonts;

  /** Creates a new project in After Effects. */
  newProject(): Project | null;

  /** Opens a project or an Open Project dialog box. */
  open(file?: File): Project | null;

  /** Quits the application. */
  quit(): void;

  /** Starts Watch Folder mode; does not return until Watch Folder mode is turned off. */
  watchFolder(folder_object_to_watch: Folder): void;

  /** Pauses a current watch-folder process. */
  pauseWatchFolder(pause: boolean): void;

  /** Ends a current watch-folder process. */
  endWatchFolder(): void;

  /** Purges a targeted type of cached information(replicates Purge options in the Edit menu). */
  purge(target: PurgeTarget): void;

  /** Groups the actions that follow it into a single undoable step. */
  beginUndoGroup(undoString: string): void;

  /** Ends an undo group; needed only when a script contains more than one undo group. */
  endUndoGroup(): void;

  /** Begins suppression of dialogs in the user interface. */
  beginSuppressDialogs(): void;

  /** Ends suppression of dialogs in the user interface. */
  endSuppressDialogs(alert: boolean): void;

  /** Sets memory usage limits as in the Memory & Cache preferences area. */
  setMemoryUsageLimits(imageCachePercentage: number, maximumMemoryPercentage: number): void;

  /** Sets whether preferences are saved when the application is quit. */
  setSavePreferencesOnQuit(doSave: boolean): void;

  /** Brings the After Effects main window to the front of the screen. */
  activate(): void;

  /** Schedules a JavaScript script for delayed execution. */
  scheduleTask(stringToExecute: string, delay: number, repeat: boolean): number;

  /** Cancels a scheduled task. */
  cancelTask(taskID: number): void;

  /** Loads a color swatch from an Adobe Swatch Exchange (ASE) file. */
  parseSwatchFile(file: File): Swatch;

  findMenuCommandId(str: string): number;

  executeCommand(id: number): void;

  /** CC2015- */
  getenv(name: string): string;

  /** CC2015- */
  setTimeout(func: Function, delay?: number): number;
  
  /** CC2015- */
  cancelTimeout(id: number): void;

  objectToJSON(object: any): string;

  /** CC 2022(22.0)-  Calling this function from a script will set the Multi-Frame Rendering configuration for the next render. After execution of the script is complete, these settings will be reset to what was previously set in the UI.*/
  setMultiFrameRenderingConfig(mfr_on: boolean, max_cpu_perc: number): void;
}

declare class Preferences {
  deletePref(section: string, key: string, type?: PREFType): void;
  getPrefAsBool(section: string, key: string, type?: PREFType): boolean;
  getPrefAsFloat(section: string, key: string, type?: PREFType): number;
  getPrefAsLong(section: string, key: string, type?: PREFType): number;
  getPrefAsString(section: string, key: string, type?: PREFType): string;
  havePref(section: string, key: string, type?: PREFType): boolean;
  reload(): void;
  savePrefAsBool(section: string, key: string, value: boolean, type?: PREFType): void;
  savePrefAsFloat(section: string, key: string, value: number, type?: PREFType): void;
  savePrefAsLong(section: string, key: string, value: number, type?: PREFType): void;
  savePrefAsString(section: string, key: string, value: string, type?: PREFType): void;
  saveToDisk(): void;
}

/** The AVItem object provides access to attributes and methods of audio/visual files imported into After Effects. */
declare class AVItem extends Item {
  /** The name of the object as shown in the Project panel. */
  name: string;

  /** The width of the item. */
  width: number;

  /** The height of the item. */
  height: number;

  /** The pixel aspect ratio of the item. */
  pixelAspect: number;

  /** The frame rate of the item. */
  frameRate: number;

  /** The frame duration for the item. */
  frameDuration: number;

  /** The total duration of the item. */
  duration: number;

  /** When true, a proxy source is used for this item. */
  useProxy: boolean;

  /** The FootageItem object used as proxy for the item. */
  readonly proxySource: FootageSource;

  /** Current time of the item. */
  time: number;

  /** The CompItem objects that use this item. */
  readonly usedIn: CompItem[];

  /** When true, the item has a video component. */
  readonly hasVideo: boolean;

  /** When true, the item has an audio component. */
  readonly hasAudio: boolean;

  /** When true, the item cannot be found or is a placeholder. */
  readonly footageMissing: boolean;

  /** CC 2020(17.1)- The time set as the beginning of the composition, in seconds. This is the equivalent of the Start Timecode or Start Frame setting in the Composition Settings dialog box. */
  displayStartTime: number;

  /** CC 2021(18.0)- Test whether the AVItem can be used as an alternate source when calling Property.setAlternateSource(). */
  readonly isMediaReplacementCompatible: boolean;

  /** Sets a proxy for the item. */
  setProxy(file: File): void;

  /** Sets a sequence as a proxy for the item. */
  setProxyWithSequence(file: File, forceAlphabetical: boolean): void;

  /** Sets a solid as a proxy for the item. */
  setProxyWithSolid(color: [number, number, number], name: string, width: number, height: number, pixelAspect: number): void;

  /** Sets a placeholder as a proxy for the item. */
  setProxyWithPlaceholder(name: string, width: number, height: number, frameRate: number, duration: number): void;

  /** Removes the proxy for the item. */
  setProxyToNone(): void;

  /** CC 2019(16.1)-*/
  addGuide(orientationType: 0 | 1, position: number): number;

  /** CC 2019(16.1)-*/
  removeGuide(guideIndex: number): void;

  /** CC 2019(16.1)-*/
  setGuide(position:number, guideIndex: number): void;
}

/** The AVLayer object provides an interface to those layers that contain AVItem objects (composition layers, footage layers, solid layers, text layers, and sound layers). */
declare class AVLayer extends Layer {
  /** The source item for this layer. */
  readonly source: AVItem;

  /** When true, the layer has no expressly set name, but contains a named source. */
  readonly isNameFromSource: boolean;

  /**  The height of the layer.*/
  readonly height: number;

  /** The width of the layer. */
  readonly width: number;

  /** When true, the layer's audio is enabled. */
  audioEnabled: boolean;

  /** When true, the layer's motion blur is enabled. */
  motionBlur: boolean;

  /** When true, the layer's effects are active. */
  effectsActive: boolean;

  /** When true, this is an adjustment layer. */
  adjustmentLayer: boolean;

  /** When true, this is a guide layer. */
  guideLayer: boolean;

  /** When true, this is a 3D layer. */
  threeDLayer: boolean;

  /** When true, 3D is set on a per-character basis in this text layer. */
  threeDPerChar: boolean;

  /** When true, this is an environment layer. */
  environmentLayer: boolean;

  /** When true, it is legal to change the value of collapseTransformation. */
  readonly canSetCollapseTransformation: boolean;

  /** When true, collapse transformation is on. */
  collapseTransformation: boolean;

  /** When true, frame blending is enabled. */
  readonly frameBlending: boolean;

  /** The type of frame blending for the layer. */
  frameBlendingType: FrameBlendingType;

  /** When true, it is legal to change the value of timeRemapEnabled. */
  readonly canSetTimeRemapEnabled: boolean;

  /** When true, time remapping is enabled on this layer. */
  timeRemapEnabled: boolean;

  /** When true, the layer contains an audio component. */
  readonly hasAudio: boolean;

  /** When true, the layer's audio is active at the current time. */
  readonly audioActive: boolean;

  /** The blending mode of the layer. */
  blendingMode: BlendingMode;

  /** When true, preserve transparency is enabled. */
  preserveTransparency: boolean;

  /** if layer has a track matte, specifies the way it is applied. */
  trackMatteType: TrackMatteType;

  /** When true, this layer is being used as a track matte for the layer below it. */
  readonly isTrackMatte: boolean;

  /** When true, the layer above is being used as a track matte on this layer. */
  readonly hasTrackMatte: boolean;

  /** The layer quality setting. */
  quality: LayerQuality;

  /** The layer sampling quality setting. */
  samplingQuality: LayerSamplingQuality;

  /** 23.0-  Returns the track matte layer for this layer. Returns null if this layer has no track matte layer. */
  readonly trackMatteLayer: AVLayer | null;

  /** Reports whether this layer's audio is active at a given time. */
  audioActiveAtTime(time: number): boolean;

  /** Calculates a transformation from a set of points in this layer. */
  calculateTransformFromPoints(pointTopLeft: [number, number, number], pointTopRight: typeof pointTopLeft, pointBottomRight: typeof pointTopLeft): { anchorPoint: [number, number, number]; position: [number, number, number]; xRotation: number; yRotation: number; zRotation: number; scale: [number, number, number]; };

  /** Changes the source item for this layer. */
  replaceSource(newSource: AVItem, fixExpressions: boolean): void;

  /** Retrieves the source rectangle of a layer. */
  sourceRectAtTime(timeT: number, extents: boolean): { top: number; left: number; width: number; height: number; };

  /** Opens the layer in a Layer panel. */
  openInViewer(): Viewer | null;

  /** CC 2014.2(13.2)- */
  sourcePointToComp(point: [number, number]): [number, number];

  /** CC 2014.2(13.2)- */
  compPointToSource(point: [number, number]): [number, number];

  /** CC 2021(18.0)- Adds the layer to the Essential Graphics Panel for the specified composition.*/
  addToMotionGraphicsTemplate(comp: CompItem): boolean;

  /** CC 2021(18.0)- Adds the layer to the Essential Graphics Panel for the specified composition.*/
  addToMotionGraphicsTemplateAs(comp: CompItem, name: string): boolean;

  /** CC 2021(18.0)- Test whether or not the layer can be added to the Essential Graphics Panel for the specified composition.*/
  canAddToMotionGraphicsTemplate(comp: CompItem): boolean;

  /** 23.0-  Sets the track matte layer and type for this layer. Passing in null to trackMatteLayer parameter removes the track matte. See AVLayer.removeTrackMatte() for another way of removing track matte.*/
  setTrackMatte(trackMatteLayer: AVLayer, trackMatteType: TrackMatteType): void;

  /** 23.0- Removes the track matte for this layer while preserving the TrackMatteType. See AVLayer.setTrackMatte() for another way of removing track matte.*/
  removeTrackMatte(): void;

  //Shortcuts
  readonly timeRemap: Property;
  readonly mask: PropertyGroup;
  readonly effect: PropertyGroup;
  readonly layerStyle: _LayerStyles;
  readonly geometryOption: _GeometryOptionsGroup;
  readonly materialOption: _MaterialOptionsGroup;
  readonly audio: _AudioGroup;
  readonly masterProperty: PropertyGroup;
  readonly essentialProperty: PropertyGroup;
}

/** The CameraLayer object represents a camera layer within a composition. Create it using the LayerCollection object’s addCamera method */
declare class CameraLayer extends Layer {
  //Shortcuts
  readonly cameraOption: _CameraOptionsGroup;
}

/** Like an array, a collection associates a set of objects or values as a logical group and provides access to them by index. However, most collection objects are read-only. You do not assign objects to them yourself—their contents update automatically as objects are created or deleted. */
declare class Collection {
  /** The number of objects in the collection. */
  readonly length: number;
}

/** The CompItem object represents a composition, and allows you to manipulate and get information about it. Access the objects by position index number in a project’s item collection. */
declare class CompItem extends AVItem {
  /** The duration of a single frame. */
  frameDuration: number;

  /** When true, indicates that the composition uses drop-frame timecode. */
  dropFrame: boolean;

  /** The work area start time. */
  workAreaStart: number;

  /** The work area duration. */
  workAreaDuration: number;

  /** The number of layers in the composition. */
  readonly numLayers: number;

  /** When true, shy layers are visible in the Timeline panel. */
  hideShyLayers: boolean;

  /** When true, motion blur is enabled for this composition. */
  motionBlur: boolean;

  /** When true, Draft 3D mode is enabled for the Composition panel. */
  draft3d: boolean;

  /** When true, time filtering is enabled for this composition. */
  frameBlending: boolean;

  /** When true, the frame rate of nested compositions is preserved. */
  preserveNestedFrameRate: boolean;

  /** When true, the resolution of nested compositions is preserved. */
  preserveNestedResolution: boolean;

  /** The background color of the composition. */
  bgColor: [number, number, number];

  /** The current active camera layer. */
  readonly activeCamera: CameraLayer | null;

  /** CC 2020(17.1)- The frame value of the beginning of the composition.*/
  displayStartFrame: number;

  /** Changes the display of the start time in the Timeline panel. */
  displayStartTime: number;

  /** The factor by which the x and y resolution of the Composition panel is downsampled. */
  resolutionFactor: [number, number];

  /** The camera shutter angle. */
  shutterAngle: number;

  /** The camera shutter phase. */
  shutterPhase: number;

  /** The minimum number of motion blur samples per frame for Classic 3D layers, shape layers, and certain effects. */
  motionBlurSamplesPerFrame: number;

  /** The maximum number of motion blur samples of 2D layer motion. */
  motionBlurAdaptiveSampleLimit: number;

  /** The layers of the composition. */
  readonly layers: LayerCollection;

  /** CC 2017(14.0)- The markers of the composition. */
  readonly markerProperty: Property;

  /** CC 2018(15.0)- The name property in the Essential Graphics panel for the composition. */
  motionGraphicsTemplateName: string;

  /** CC 2019(16.1)-*/
  readonly motionGraphicsTemplateControllerCount: number;

  /** The selected layers of the composition. */
  readonly selectedLayers: Layer[];

  /** The selected properties of the composition. */
  readonly selectedProperties: PropertyBase[];

  /** The rendering plug-in module to be used to render this composition. */
  renderer: string;

  /** The set of available rendering plug-in modules. */
  readonly renderers: string[];

  /** Creates and returns a duplicate of this composition. */
  duplicate(): CompItem;

  /** CC 2018(15.0)- Export the composition as a Motion Graphics template. */
  exportAsMotionGraphicsTemplate(doOverWriteFileIfExisting: boolean, file_path?: File): boolean;

  /** Gets a layer from this composition. */
  layer(index: number): Layer;
  layer(otherLayer: Layer, relIndex: number): Layer;
  layer(name: string): Layer;

  /** CC 2018(15.0) Open the composition in the Essential Graphics panel. */
  openInEssentialGraphics(): void;

  /** Opens the composition in a Composition panel. */
  openInViewer(): Viewer | null;

  /** Save the specific frame to a png file */
  saveFrameToPng(time: number, file: File);

  /** CC 2019(16.1)-*/
  getMotionGraphicsTemplateControllerName(index: number): string;

  /** CC 2019(16.1)-*/
  setMotionGraphicsControllerName(index: number, newName: string): string;
}

/** The FileSource object describes footage that comes from a file. */
declare class FileSource extends FootageSource {
  /** The file that defines this asset. */
  readonly file: File;

  /** The file that contains footage missing from this asset. */
  readonly missingFootagePath: string;

  /** Reloads the asset from the file, if it is a mainSource of a FootageItem. */
  reload(): void;
}

/** The FolderItem object corresponds to a folder in your Project panel. It can contain various types of items (footage, compositions, solids) as well as other folders. */
declare class FolderItem extends Item {
  /** The contents of this folder. */
  readonly items: ItemCollection;

  /** The number of items contained in the folder. */
  readonly numItems: number;

  /** Gets an item from the folder. */
  item(index: number): Item;
}

/** The FootageItem object represents a footage item imported into a project, which appears in the Project panel. These are accessed by position index number in a project’s item collection. */
declare class FootageItem extends AVItem {
  /** The footage source file. */
  readonly file: File | null;

  /** All settings related to the footage item. */
  readonly mainSource: FootageSource;

  /** Replaces a footage file with another footage file. */
  replace(file: File): void;

  /** Replaces a footage file with a placeholder object. */
  replaceWithPlaceholder(name: string, width: number, height: number, frameRate: number, duration: number): void;

  /** Replaces a footage file with an image sequence. */
  replaceWithSequence(file: File, forceAlphabetical: boolean): void;

  /** Replaces a footage file with a solid. */
  replaceWithSolid(color: [number, number, number], name: string, width: number, height: number, pixelAspect: number): void;

  /** Opens the footage in a Footage panel. */
  openInViewer(): Viewer | null;
}

declare class PlaceholderItem extends FootageItem { }

/** The FootageSource object holds information describing the source of some footage. It is used as the mainSource of a FootageItem, or the proxySource of a CompItem or FootageItem. */
declare class FootageSource {
  /** When true, a footage clip or proxy includes an alpha channel. */
  hasAlpha: boolean;

  /** The mode of an alpha channel. */
  alphaMode: AlphaMode;

  /** The color to be premultiplied. */
  premulColor: [number, number, number];

  /** When true, an alpha channel in a footage clip or proxy should be inverted. */
  invertAlpha: boolean;

  /** When true, footage is a still image. */
  readonly isStill: boolean;

  /** The field separation type. */
  fieldSeparationType: FieldSeparationType;

  /** How the fields are to be separated in non-still footage. */
  highQualityFieldSeparation: boolean;

  /** The pulldown type for the footage. */
  removePulldown: PulldownPhase;

  /** How many times an image sequence is set to loop. */
  loop: number;

  /** The native frame rate of the footage. */
  nativeFrameRate: number;

  /** The effective frame rate as displayed and rendered in compositions by After Effects. */
  readonly displayFrameRate: number;

  /** The rate to which footage should conform. */
  conformFrameRate: number;

  /** Estimates the alphaMode setting. */
  guessAlphaMode(): void;

  /** Estimates the pulldownType setting. */
  guessPulldown(method: PulldownMethod): void;
}

/** The ImportOptions object encapsulates the options used to import a file with the Project.importFile methods. */
declare class ImportOptions {
  constructor(file?: File);

  /** The type of file to be imported. */
  importAs: ImportAsType;

  /** When true, import a sequence of files, rather than an individual file. */
  sequence: boolean;

  /** When true, the “Force alphabetical order” option is set. */
  forceAlphabetical: boolean;

  /** The file to import, or the first file of the sequence to import. */
  file: File;

  /** Restricts input to a particular file type. */
  canImportAs(type: ImportAsType): boolean;
}

/** The Item object represents an item that can appear in the Project panel. */
declare class Item {
  /** The name of the object as shown in the Project panel. */
  name: string;

  /** A descriptive string. */
  comment: string;

  /** A unique identifier for this item. */
  readonly id: number;

  /** The parent folder of this item. */
  parentFolder: FolderItem;

  /** When true, this item is currently selected. */
  selected: boolean;

  /** The type of item. */
  readonly typeName: string;

  /** The label color for the item. */
  label: number;

  /** Deletes the item from the project. */
  remove(): void;
}

/** The ItemCollection object represents a collection of items. The ItemCollection belonging to a Project object contains all the Item objects for items in the project. The ItemCollection belonging to a FolderItem object contains all the Item objects for items in that folder. */
declare class ItemCollection extends Collection {
  /** Retrieves a Item object in the collection by its index number. The first object is at index 1. */
  readonly [index: number]: Item;

  /** Creates a new CompItem object and adds it to the collection. */
  addComp(name: string, width: number, height: number, pixelAspect: number, duration: number, frameRate: number): CompItem;

  /** Creates a new FolderItem object and adds it to the collection. */
  addFolder(name: string): FolderItem;
}

/** The KeyframeEase object encapsulates the keyframe ease settings of a layer’s AE property. Keyframe ease is determined by the speed and influence values that you set using the property’s setTemporalEaseAtKey method. */
declare class KeyframeEase {
  constructor(speed: number, influence: number);

  /** The speed setting for a keyframe. */
  speed: number;

  /** The influence setting for a keyframe. */
  influence: number;
}

/** The Layer object provides access to layers within compositions. It can be accessed from an item’s layer collection either by index number or by a name string. */
declare interface Layer {
  (index: number): PropertyBase;
  (name: string): PropertyBase;
}

declare class Layer {
  /** The index position of the layer. */
  readonly index: number;

  /** The name of the layer. */
  name: string;

  /** The parent of this layer. */
  parent: Layer | null;

  /** The current time of the layer. */
  readonly time: number;

  /** The start time of the layer. */
  startTime: number;

  /** The time stretch percentage of the layer. */
  stretch: number;

  /** The “in” point of the layer. */
  inPoint: number;

  /** The “out” point of the layer. */
  outPoint: number;

  /** When true, the layer is enabled. */
  enabled: boolean;

  /** When true, the layer is soloed. */
  solo: boolean;

  /** When true, the layer is shy. */
  shy: boolean;

  /** When true, the layer is locked. */
  locked: boolean;

  /** When true, the layer contains a video component. */
  readonly hasVideo: boolean;

  /** When true, the layer is active at the current time. */
  readonly active: boolean;

  /** When true, this is a null layer. */
  readonly nullLayer: boolean;

  /** All selected AE properties in the layer. */
  readonly selectedProperties: PropertyBase[];

  /** A descriptive comment for the layer. */
  comment: string;

  /** The composition that contains this layer. */
  readonly containingComp: CompItem;

  /** When true, the layer’s name has been explicitly set. */
  readonly isNameSet: boolean;

  /** The label color for the layer. */
  label: number;

  /** The type of automatic orientation for the layer. */
  autoOrient: AutoOrientType;

  /** CC2022(22.0)- Instance property on Layer which returns a unique and persistent identification number used internally to identify a Layer between sessions. The value of the ID remains the same when the project is saved to a file and later reloaded. However, when you import this project into another project, new IDs are assigned to all Layers in the imported project. The ID is not displayed anywhere in the user interface..*/
  readonly id: number;

  /** Deletes the layer from the composition. */
  remove(): void;

  /** Moves the layer to the top of the composition (makes it the first layer). */
  moveToBeginning(): void;

  /** Moves the layer to the bottom of the composition (makes it the last layer). */
  moveToEnd(): void;

  /** Moves the layer below another layer. */
  moveAfter(layer: Layer): void;

  /** Moves the layer above another layer. */
  moveBefore(layer: Layer): void;

  /** Duplicates the layer. */
  duplicate(): this;

  /** Copies the layer to the top (beginning) of another composition. */
  copyToComp(intoComp: CompItem): void;

  /** Reports whether this layer will be active at a specified time. */
  activeAtTime(time: number): boolean;

  /** Sets a new parent for this layer. */
  setParentWithJump(newParent?: Layer): void;

  /** Applies a named collection of animation settings to the layer. */
  applyPreset(presetName: File): void;

  /** CC 2022(22.3)-  Runs Scene Edit Detection on the layer that the method is called on and returns an array containing the times of any detected scenes. This is the same as selecting a layer in the Timeline and choosing “Layer > Scene Edit Detection” with the single argument determining whether the edits are applied as markers, layer splits, pre-comps, or are not applied to the layer. Just as in the UI, doSceneEditDetection will fail and error if called on a non-video layer or a video layer with Time Remapping enabled.*/
  doSceneEditDetection(applyOptions: SceneEditDetectionMode): number[];

  //From PropertyGroup
  readonly matchName: string;
  readonly propertyDepth: number;
  readonly propertyType: PropertyType;
  selected: boolean;
  readonly numProperties: number;

  propertyGroup(countUp?: number): PropertyGroup;
  property(index: number): PropertyBase;
  property(name: string): PropertyBase;

  //Shortcuts
  readonly marker: Property;
  readonly transform: _TransformGroup;
}

/** The LayerCollection object represents a set of layers. The LayerCollection belonging to a CompItem object contains all the layer objects for layers in the composition. The methods of the collection object allow you to manipulate the layer list. */
declare class LayerCollection extends Collection {
  /** Retrieves a Layer object in the collection by its index number. The first object is at index 1. */
  readonly [index: number]: Layer;

  /** Creates a new AVLayer and adds it to this collection. */
  add(item: AVItem, duration?: number): AVLayer;

  /** Creates a new, null layer and adds it to this collection. */
  addNull(duration?: number): AVLayer;

  /** Creates a new layer, a FootageItem with a SolidSource, and adds it to this collection. */
  addSolid(color: [number, number, number], name: string, width: number, height: number, pixelAspect: number, duration?: number): AVLayer;

  /** Creates a new point text layer and adds it to this collection. */
  addText(sourceText?: string | TextDocument): TextLayer;

  /** Creates a new paragraph (box) text layer and adds it to this collection. */
  addBoxText([width, height]: [number, number], sourceText?: string | TextDocument): TextLayer;

  /** 24.2-  Creates a new point text layer with TextDocument.lineOrientation set to LineOrientation.VERTICAL_RIGHT_TO_LEFT and adds the new TextLayer object to this collection. To create a paragraph (box) text layer, use the LayerCollection.addBoxText() or LayerCollection.addVerticalBoxText() methods.*/
  addVerticalText(sourceText?: string | TextDocument): TextLayer;

  /** 24.2- Creates a new paragraph (box) text layer with TextDocument.lineOrientation set to LineOrientation.VERTICAL_RIGHT_TO_LEFT and adds the new TextLayer object to this collection. To create a point text layer, use the LayerCollection.addText() or LayerCollection.addVerticalText() methods. */
  addVerticalBoxText([width, height]: [number, number]): TextLayer;

  /** Creates a new camera layer and adds it to this collection. */
  addCamera(name: string, centerPoint: [number, number]): CameraLayer;

  /** Creates a new light layer and adds it to this collection. */
  addLight(name: string, centerPoint: [number, number]): LightLayer;

  /** Creates a new shape layer and adds it to this collection. */
  addShape(): ShapeLayer;

  /** Retrieves the layer object with a specified name. */
  byName(name: string): Layer | null;

  /** Collects specified layers into a new composition. */
  precompose(layerIndicies: number[], name: string, moveAllAttributes?: boolean): CompItem;
}

/** The LightLayer object represents a light layer within a composition. Create it using the LayerCollection object’s addLight method */
declare class LightLayer extends Layer {
  /** For light layers, the type of light. */
  lightType: LightType;

  //Shortcuts
  readonly lightOption: _LightOptionsGroup;
}

/** The MarkerValue object represents a layer marker, which associates a comment, and optionally a chapter reference point, Web-page link, or Flash Video cue point with a particular point in a layer. */
declare class MarkerValue {
  constructor(comment: string, chapter?: string, url?: string, frameTarget?: string, cuePointName?: string, params?: string);

  /** A comment on the associated layer. */
  comment: string;

  /** The amount of time represented by the marker. */
  duration: number;

  /** A chapter link reference point for the associated layer. */
  chapter: string;

  /** The Flash Video cue point name. */
  cuePointName: string;

  /** Whether the Flash Video cue point is for an event or navigation. */
  eventCuePoint: boolean;

  /** A URL for Web page to be associated with the layer. */
  url: string;

  /** A specific frame target within the Web page specified by url. */
  frameTarget: string;

  /** CC2019(16.0)- */
  label: number;

  /** CC2019(16.0)- */
  protectedRegion: number;

  /** Retrieves the key-value pairs associated with the marker value. */
  getParameters(): Object;

  /** Sets the key-value pairs associated with the marker value. */
  setParameters(keyValuePairs: Object): void;
}

/** The MaskPropertyGroup object encapsulates mask attributes in a layer. */
declare class MaskPropertyGroup extends PropertyGroup {
  /** The mask mode. */
  maskMode: MaskMode;

  /** When true, the mask is inverted. */
  inverted: boolean;

  /** When true, the shape of the mask is RotoBezier. */
  rotoBezier: boolean;

  /** How motion blur is applied to this mask. */
  maskMotionBlur: MaskMotionBlur;

  /** When true, the mask is locked. */
  locked: boolean;

  /** The color used to draw the mask outline in the user interface. */
  color: [number, number, number];

  /** The feather falloff mode for the mask. */
  maskFeatherFalloff: MaskFeatherFalloff;

  readonly maskShape: Property;

  readonly maskFeather: Property;

  readonly maskOpacity: Property;

  readonly maskExpansion: Property;
}

/** The OMCollection contains all of the output modules in a render queue. The collection provides access to the OutputModule objects, but does not provide any additional functionality. The first OutputModule object in the collection is at index position 1. */
declare class OMCollection extends Collection {
  /** Retrieves a OutputModule object in the collection by its index number. The first object is at index 1. */
  readonly [index: number]: OutputModule;
}

/** An OutputModule object of a RenderQueueItem generates a single file or sequence via a render operation, and contains attributes and methods relating to the file to be rendered. */
declare class OutputModule {
  /** The path and name of the file to be rendered. */
  file: File;

  /** An action to be taken after rendering. */
  postRenderAction: PostRenderAction;

  /** The user-interface name of the output module. */
  readonly name: string;

  /** All templates for the output module */
  readonly templates: string[];

  /** When true, writes all source footage XMP metadata to the output file. */
  includeSourceXMP: boolean;

  /** Removes this output module from the render-queue item’s list. */
  remove(): void;

  /** Saves a new output-module template. */
  saveAsTemplate(name: string): void;

  /** Applies an output-module template. */
  applyTemplate(templateName: string): void;

  getSetting(key: string): string | number;

  getSettings(format?: GetSettingsFormat): {
    'Audio Bit Depth';
    'Audio Channels';
    'Audio Sample Rate';
    'Channels';
    'Color';
    'Crop';
    'Crop Bottom';
    'Crop Left';
    'Crop Right';
    'Crop Top';
    'Depth';
    'Format';
    'Include Project Link';
    'Include Source XMP Metadata';
    'Lock Aspect Ratio';
    'Output Audio';
    'Output File Info';
    'Post-Render Action';
    'Resize';
    'Resize Quality';
    'Resize to';
    'Starting #';
    'Use Comp Frame Number';
    'Use Region of Interest';
    'Video Output';
  };

  setSetting(key: string, value: string | number): void;

  setSettings(settings: Object): void;
}

/** The PlaceholderSource object describes the footage source of a placeholder. */
declare class PlaceholderSource extends FootageSource { }

/** The project object represents an After Effects project. Attributes provide access to specific objects within the project, such as imported files or footage and compositions, and also to project settings such as the timecode base. Methods can import footage, create solids, compositions and folders, and save changes. */
declare class Project {
  /** The file for the currently open project. */
  readonly file: File | null;

  /** The folder containing all the contents of the project; the equivalent of the Project panel */
  readonly rootFolder: FolderItem;

  /** All items in the project. */
  readonly items: ItemCollection;

  /** The currently active item. */
  readonly activeItem: Item | null;

  /** The color depth of the current project. */
  bitsPerChannel: number;

  /** When true, thumbnail views use the transparency checkerboard pattern. */
  transparencyGridThumbnails: boolean;

  /** The total number of items contained in the project. */
  readonly numItems: number;

  /** All items selected in the Project panel. */
  readonly selection: Item[];

  /** The project’s render queue. */
  readonly renderQueue: RenderQueue;

  /** The time display style, corresponding to the Time Display Style section in the Project Settings dialog box. */
  timeDisplayType: TimeDisplayType;

  /** CC 2017(14.0)- The active tool in the Tools panel. */
  toolType: ToolType;

  /** The Footage Start Time setting in the Project Settings dialog box, which is enabled when Timecode is selected as the time display style. */
  footageTimecodeDisplayStartType: FootageTimecodeDisplayStartType;

  /** The Use Feet + Frames setting in the Project Settings dialog box. */
  framesUseFeetFrames: boolean;

  /** The Use Feet + Frames menu setting in the Project Settings dialog box. */
  feetFramesFilmType: FeetFramesFilmType;

  /** CC 2015.3(13.8)- */
  gpuAccelType: GpuAccelType;

  /** The Frame Count menu setting in the Project Settings dialog box. */
  framesCountType: FramesCountType;

  /** The frame at which to start numbering when displaying the project. */
  displayStartFrame: number;

  /** When true, linear blending is used for the project. */
  linearBlending: boolean;

  /** The project’s XMP metadata. */
  xmpPacket: string;

  /** CC2019(16.0)- */
  workingGamma: 2.2 | 2.4;

  /** CC2019(16.0)- */
  workingSpace: string;

  /** CC2019(16.0)- */
  expressionEngine: 'extendscript' | 'javascript-1.0';

  /** True if the project has been modified from the last save; otherwise false. (CC2020-) */
  readonly dirty: boolean;

  /** 24.0- Returns an Array of Objects containing references to used fonts and the Text Layers and times on which they appear in the current Project. Each object is composed of font which is a Font object, and usedAt which is an Array of Objects, each composed of layerID, a Layer.id, and layerTimeD for when. See Project.layerByID() to retrieve the layers. */
  readonly usedFonts: { font: Font; usedAt: { layerID: number; layerTimeD: number; }[] }[];

  /** Retrieves an item from the project. */
  item(index: number): Item;

  /** Consolidates all footage in the project. */
  consolidateFootage(): number;

  /** Removes unused footage from the project. */
  removeUnusedFootage(): number;

  /** Reduces the project to a specified set of items. */
  reduceProject(array_of_items: Item[]): number;

  /** Closes the project with normal save options. */
  close(closeOptions: CloseOptions): boolean;

  /** Saves the project. */
  save(file?: File): void;

  /** Displays a Save dialog box. */
  saveWithDialog(): boolean;

  /** Imports a placeholder into the project. */
  importPlaceholder(name: string, width: number, height: number, frameRate: number, duration: number): PlaceholderItem;

  /** Imports a file into the project. */
  importFile(importOptions: ImportOptions): FootageItem | FolderItem | CompItem;

  /** Displays an Import File dialog box. */
  importFileWithDialog(): Item[] | null;

  /** Shows or hides the Project panel. */
  showWindow(doShow: boolean): void;

  /** Automatically replaces text in all expressions. */
  autoFixExpressions(oldText: string, newText: string): void;

  /** CC 2017.2(14.2)- Creates a new team project. Returns true if the team project is successfully created, false otherwise. */
  newTeamProject(teamProjectName: string, description?: string): boolean;

  /** CC 2017.2(14.2)- Opens a team project. Returns true if the team project is successfully opened, false otherwise. */
  openTeamProject(teamProjectName: string): boolean;

  /** CC 2017.2(14.2)- Shares the currently open team project. Returns true if the team project is successfully shared, false otherwise. */
  shareTeamProject(comment?: string): boolean;

  /** CC 2017.2(14.2)- Syncs the currently open team project. Returns true if the team project is successfully synced, false otherwise. */
  syncTeamProject(): boolean;

  /** CC 2017.2(14.2)- Closes a currently open team project. Returns true if the command was successful, false otherwise. */
  closeTeamProject(): boolean;

  /** CC 2017.2(14.2)- Converts a team project to an After Effects project on a local disk. Returns true if the command was successful, false otherwise. */
  convertTeamProjectToProject(project: File): boolean;

  /** CC 2017.2(14.2)- Returns an array containing the name strings for all team projects available for the current user. Archived Team Projects are not included. */
  listTeamProjects(): string[];

  /** CC 2017.2(14.2)- Returns true if the specified team project is currently open, false otherwise. */
  isTeamProjectOpen(teamProjectName: string): boolean;

  /** CC 2017.2(14.2)- Returns true if any team project is currently open, false otherwise. */
  isAnyTeamProjectOpen(): boolean;

  /** CC 2017.2(14.2)- Checks whether or not team projects is enabled for After Effects. Returns true if team projects is currently enabled, false otherwise. (This will almost always return true.) */
  isTeamProjectEnabled(): boolean;

  /** CC 2017.2(14.2)- Returns true if the client (After Effects) is currently logged into the team projects server, false otherwise. */
  isLoggedInToTeamProject(): boolean;

  /** CC 2017.2(14.2)- Returns true if the team projects Sync command is enabled, false otherwise. */
  isSyncCommandEnabled(): boolean;

  /** CC 2017.2(14.2)- Returns true if the team projects Share command is enabled, false otherwise. */
  isShareCommandEnabled(): boolean;

  /** CC 2017.2(14.2)- Returns true if the team projects Resolve command is enabled, false otherwise. */
  isResolveCommandEnabled(): boolean;

  /** CC 2017.2(14.2)- Resolves a conflict between the open team project and the version on the team projects server, using the specified resolution method. Returns true if the resolution of the specified type was successful, false otherwise. */
  resolveConflict(ResolveType: ResolveType): boolean;

  /** CC2019(16.0)- */
  listColorProfiles(): string[];

  /** CC2022(22.0)- Instance method on Project which, when given a valid ID value, returns the Layer object in the Project with that given ID.*/
  layerByID(id: number): Layer | null;

  /** 24.0-  
    This function will replace all the usages of Font object fromFont with Font object toFont.

    This operation exposes the same mechanism and policy used for automatic font replacement of missing or substituted fonts and is therefore a complete and precise replacement, even on TextDocuments which have mixed styling, preserving the character range the fromFont was applied to.

    This operation is not undoable.

    The optional parameter noFontLocking controls what happens when the toFont has no glyphs for the text it is applied to. By default a fallback font will be selected which will have the necessary glyphs, but if this parameter is set to true then this fallback will not take place and missing glyphs will result. There is no way at the current time to detect or report this.

    Note that when fromFont is a substituted font and the toFont has the same font properties no fallback can occur and the parameter is ignored and treated as true.
  */
  replaceFont(fromFont: Font, toFont: Font, noFontLocking?: boolean /*= false*/): boolean;
}

declare type PropertyValue = void | boolean | number | [number, number] | [number, number, number] | [number, number, number, number] | MarkerValue | Shape | TextDocument;

/** The Property object contains value, keyframe, and expression information about a particular AE property of a layer. */
declare class Property extends PropertyBase {
  /** Type of value stored in this property. */
  readonly propertyValueType: PropertyValueType;

  /** Current value of the property. */
  readonly value: PropertyValue;

  /** When true, there is a minimum permitted value. */
  readonly hasMin: boolean;

  /** When true, there is a maximum permitted value. */
  readonly hasMax: boolean;

  /** The minimum permitted value. */
  readonly minValue: number;

  /** The maximum permitted value. */
  readonly maxValue: number;

  /** When true, the property defines a spatial value. */
  readonly isSpatial: boolean;

  /** When true, the property can be keyframed. */
  readonly canVaryOverTime: boolean;

  /** When true, the property has keyframes or an expression enabled that can vary its values. */
  readonly isTimeVarying: boolean;

  /** The number of keyframes on this property. */
  readonly numKeys: number;

  /** A text description of the units in which the value is expressed. */
  readonly unitsText: string;

  /** The expression string for this property. */
  expression: string;

  /** When true, the expression can be set by a script. */
  readonly canSetExpression: boolean;

  /** When true, the expression is used to generate values for the property. */
  expressionEnabled: boolean;

  /** The error, if any, that occurred when the last expression was evaluated. */
  readonly expressionError: string;

  /** All selected keyframes of the property. */
  readonly selectedKeys: number[];

  /** The position index of this property. */
  readonly propertyIndex: number;

  /** When true, the property’s dimensions are represented as separate properties. */
  dimensionsSeparated: boolean;

  /** When true, the property represents one of the separated dimensions for a multidimensional property. */
  readonly isSeparationFollower: boolean;

  /** When true, the property is multidimensional and can be separated. */
  readonly isSeparationLeader: boolean;

  /** For a separated follower, the dimension it represents in the multidimensional leader. */
  readonly separationDimension: number;

  /** The original multidimensional property for this separated follower. */
  readonly separationLeader: Property;

  /** 2020(17.0.1)- Returns true if the property is a Dropdown Menu Control effect.*/
  readonly isDropdownEffect: boolean;

  /** CC 2021(18.0)- */
  readonly alternateSource: AVItem;

  /** CC 2021(18.0)- Test whether the property is an Essential Property that supports Media Replacement. */
  readonly canSetAlternateSource: boolean;

  /** CC 2022(22.0)-  Instance property on an Essential Property object which returns the original source Property which was used to create the Essential Property.*/
  essentialPropertySource: Property | AVLayer;

  /** CC 2018(15.0)- Add the property to the Essential Graphics panel for the specified composition. */
  addToMotionGraphicsTemplate(comp: CompItem): boolean;

  /** CC 2018(15.0)- Test whether or not the property can be added to the Essential Graphics panel for the specified composition. */
  canAddToMotionGraphicsTemplate(comp: CompItem): boolean;

  /** Gets the value of the property evaluated at given time. */
  valueAtTime(time: number, preExpression: boolean): PropertyValue;

  /** Sets the static value of the property. */
  setValue(newValue: PropertyValue): void;

  /** Creates a keyframe for the property. */
  setValueAtTime(time: number, newValue: PropertyValue): void;

  /** Creates a set of keyframes for the property. */
  setValuesAtTimes(times: number[], newValues: PropertyValue[]): void;

  /** Finds a keyframe and sets the value of the property at that keyframe. */
  setValueAtKey(keyIndex: number, newValue: PropertyValue): void;

  /** Gets the keyframe nearest to a specified time. */
  nearestKeyIndex(time: number): number;

  /** Gets the time at which a condition occurs. */
  keyTime(keyIndex: number): number;
  keyTime(markerComment: string): number;

  /** Gets the value of a keyframe at the time at which a condition occurs. */
  keyValue(keyIndex: number): PropertyValue;
  keyValue(markerComment: string): MarkerValue;

  /** Adds a new keyframe to the property at a given time. */
  addKey(time: number): number;

  /** Removes a keyframe from the property. */
  removeKey(keyIndex: number): void;

  /** When true, this property can be interpolated. */
  isInterpolationTypeValid(type: KeyframeInterpolationType): boolean;

  /** Sets the interpolation type for a key. */
  setInterpolationTypeAtKey(keyIndex: number, inType: KeyframeInterpolationType, outType: KeyframeInterpolationType): void;

  /** Gets the 'in' interpolation type for a key. */
  keyInInterpolationType(keyIndex: number): KeyframeInterpolationType;

  /** Gets the 'out' interpolation type for a key. */
  keyOutInterpolationType(keyIndex: number): KeyframeInterpolationType;

  /** Sets the “in” and “out” tangent vectors for a key. */
  setSpatialTangentsAtKey(keyIndex: number, inTangent: [number, number, number?], outTangent: typeof inTangent): void;

  /** Gets the “in” spatial tangent for a key. */
  keyInSpatialTangent(keyIndex: number): [number, number, number?];

  /** Gets the “out” spatial tangent for a key. */
  keyOutSpatialTangent(keyIndex: number): [number, number, number?];

  /** Sets the “in” and “out” temporal ease for a key. */
  setTemporalEaseAtKey(keyIndex: number, inTemporalEase: [KeyframeEase, KeyframeEase?, KeyframeEase?], outTemporalEase: typeof inTemporalEase): void;

  /** Gets the “in” temporal ease for a key. */
  keyInTemporalEase(keyIndex: number): [KeyframeEase, KeyframeEase?, KeyframeEase?];

  /** Gets the “out” temporal ease for a key. */
  keyOutTemporalEase(keyIndex: number): [KeyframeEase, KeyframeEase?, KeyframeEase?];

  /** Sets whether a keyframe has temporal continuity. */
  setTemporalContinuousAtKey(keyIndex: number, newVal: boolean): void;

  /** Reports whether a keyframe has temporal continuity. */
  keyTemporalContinuous(keyIndex: number): boolean;

  /** Sets whether a keyframe has temporal auto-Bezier. */
  setTemporalAutoBezierAtKey(keyIndex: number, newVal: boolean): void;

  /** Reports whether a keyframe has temporal auto-Bezier. */
  keyTemporalAutoBezier(keyIndex: number): boolean;

  /** Sets whether a keyframe has spatial continuity. */
  setSpatialContinuousAtKey(keyIndex: number, newVal: boolean): void;

  /** Reports whether a keyframe has spatial continuity. */
  keySpatialContinuous(keyIndex: number): boolean;

  /** Sets whether a keyframe has spatial auto-Bezier. */
  setSpatialAutoBezierAtKey(keyIndex: number, newVal: boolean): void;

  /** Reports whether a keyframe has spatial auto-Bezier. */
  keySpatialAutoBezier(keyIndex: number): boolean;

  /** Sets whether a keyframe is roving. */
  setRovingAtKey(keyIndex: number, newVal: boolean): void;

  /** Reports whether a keyframe is roving. */
  keyRoving(keyIndex: number): boolean;

  /** Sets whether a keyframe is selected. */
  setSelectedAtKey(keyIndex: number, onOff: boolean): void;

  /** Reports whether a keyframe is selected. */
  keySelected(keyIndex: number): boolean;

  /** For a separated, multidimensional property, retrieves a specific follower property. */
  getSeparationFollower(dim: number): Property;

  /** 2020(17.0.1)- Sets parameters for a Property.*/
  setPropertyParameters(items: string[]): Property;

  /** CC 2019(16.1)-*/
  addToMotionGraphicsTemplateAs(comp: CompItem, name: string): boolean;

  /** CC 2021(18.0)- Set the alternate source for this property.*/
  setAlternateSource(newSource: AVItem): void;

  /** 22.6- The label color for the keyframe. Colors are represented by their number (0 for None, or 1 to 16 for one of the preset colors in the Labels preferences). */
  keyLabel(keyIndex: number): number;

  /** 22.6- Set the label color for the keyframe. Colors are represented by their number (0 for None, or 1 to 16 for one of the preset colors in the Labels preferences). */
  setLabelAtKey(keyIndex: number, labelIndex: number): void;
}

/** Properties are accessed by name through layers, using various kinds of expression syntax, as controlled by application preferences. */
declare interface PropertyBase {
  (index: number): PropertyBase;
  (name: string): PropertyBase;
}

declare class PropertyBase {
  /** Name of the property. */
  name: string;

  /** A special name for the property used to build unique naming paths. */
  readonly matchName: string;

  /** Index of this property within its parent group. */
  readonly propertyIndex: number;

  /** The number of levels of parent groups between this property and the containing layer. */
  readonly propertyDepth: number;

  /** The property type. */
  readonly propertyType: PropertyType;

  /** The immediate parent group of this property. */
  readonly parentProperty: PropertyGroup;

  /** When true, the property has been changed since its creation. */
  readonly isModified: boolean;

  /** When true, the user interface displays an eyeball icon for this property. */
  readonly canSetEnabled: boolean;

  /** When true, this property is enabled. */
  enabled: boolean;

  /** When true, this property is active. */
  readonly active: boolean;

  /** When true, this property is not displayed in the user interface. */
  readonly elided: boolean;

  /** When true, this property is an effect. */
  readonly isEffect: boolean;

  /** When true, this property is a mask. */
  readonly isMask: boolean;

  /** When true, this property is selected. */
  selected: boolean;

  /** When true, the property is the Menu property of a Dropdown Menu Control effect and can have its items updated with setPropertyParameters.(CC2020-) */
  isDropdownEffect: boolean;

  /** Gets the parent group for this property. */
  propertyGroup(countUp?: number): PropertyGroup;

  /** Removes this from the project. */
  remove(): void;

  /** Moves this property to a new position in its parent group. */
  moveTo(newIndex: number): void;

  /** Duplicates this property object. */
  duplicate(): PropertyBase;

  /** Gets a member property or group. Strictly, this should be PropertyGroup method. */
  property(index: number): PropertyBase;
  property(name: string): PropertyBase;

  /** Sets parameters for a Dropdown Menu Control’s Menu Property. This method will overwrite the existing set of Menu items with the provided array of strings.(CC2020-) */
  setPropertyParameters(items: string[]): void;
}

/** The PropertyGroup object represents a group of properties. It can contain Property objects and other PropertyGroup objects. Property groups can be nested to provide a parent-child hierarchy, with a Layer object at the top (root) down to a single Property object, such as the mask feather of the third mask. To traverse the group hierarchy, use PropertyBase methods and attributes. */
declare class PropertyGroup extends PropertyBase {
  /** The number of indexed properties in the group. */
  readonly numProperties: number;

  /** Gets a member property or group. */
  //property(index: number): PropertyBase;
  //property(name: string): PropertyBase;

  /** Reports whether a property can be added to the group. */
  canAddProperty(name: string): boolean;

  /** Adds a property to the group. */
  addProperty(name: string): PropertyBase;
}

/** The RenderQueue object represents the render automation process, the data and functionality that is available through the Render Queue panel of a particular After Effects project. Attributes provide access to items in the render queue and their render status. Methods can start, pause, and stop the rendering process. */
declare class RenderQueue {
  /** When true, a render is in progress. */
  readonly rendering: boolean;

  /** The total number of items in the render queue. */
  readonly numItems: number;

  /** CC 2017(14.0)- indicates whether or not there are queued render items in the After Effects render queue. Only queued items can be added to the AME queue.*/
  readonly canQueueInAME: boolean;

  /** The collection of items in the render queue. */
  readonly items: RQItemCollection;

  /** CC 2022(22.0)- Read or write the Notify property for the entire Render Queue. This is exposed in the UI as a checkbox in the lower right corner of the Render Queue panel.*/
  queueNotify: boolean;

  /** CC 2022(22.0)- Scripts can read and write the Notify checkbox for each individual item in the Render Queue. This is exposed in the UI as a checkbox next to each Render Queue item in the Notify column. This column is hidden by default and may need to be selected to be visible by right clicking on the Render Queue column headers and choosing Notify.*/
  queueItemNotify: boolean;

  /** Show or hides the Render Queue panel. */
  showWindow(doShow: boolean): void;

  /** Starts the rendering process; does not return until render is complete. */
  render(): void;

  /** Pauses or restarts the rendering process. */
  pauseRendering(pause: boolean): void;

  /** Stops the rendering process. */
  stopRendering(): void;

  /** Gets a render-queue item from the collection. */
  item(index: number): RenderQueueItem;

  /** CC 2017(14.0)- Calls the Queue In AME command. This method requires passing a boolean value, telling AME whether to only queue the render items (false) or if AME should also start processing its queue (true).*/
  queueInAME(render_immediately_in_AME: boolean): void;
}

/** The RenderQueueItem object represents an individual item in the render queue. It provides access to the specific settings for an item to be rendered. Create the object by adding a composition to the Render Queue with the RQItemCollection object; */
declare class RenderQueueItem {
  /** The total number of Output Modules assigned to the item. */
  readonly numOutputModules: number;

  /** When true, this item is rendered when the queue is started. */
  render: boolean;

  /** The time when rendering began for the item. */
  readonly startTime: Date | null;

  /** The time elapsed in the current rendering of this item. */
  readonly elapsedSeconds: number | null;

  /** The start time in the composition to be rendered. */
  timeSpanStart: number;

  /** The duration of the composition to be rendered. */
  timeSpanDuration: number;

  /** The number of frames to skip when rendering this item. */
  skipFrames: number;

  /** The composition to be rendered by this item. */
  readonly comp: CompItem;

  /** The collection of Output Modules for this item. */
  readonly outputModules: OMCollection;

  /** A set of Render Settings templates. */
  readonly templates: string[];

  /** The current rendering status of the item. */
  readonly status: RQItemStatus;

  /** A callback function that is called during the rendering process when the status of the item changes. */
  onStatusChanged: string | null;

  /** A log type for this item. */
  logType: LogType;

  /** Gets an Output Module for the item. */
  outputModule(index: number): OutputModule;

  /** Removes the item from the render queue. */
  remove(): void;

  /** Saves a new Render Settings template. */
  saveAsTemplate(name: string): void;

  /** Applies a Render Settings template. */
  applyTemplate(templateName: string): void;

  /** Duplicates this item. */
  duplicate(): RenderQueueItem;

  getSetting(key: string): string | number;

  getSettings(format: GetSettingsFormat): Object;

  setSetting(key: string, value: string | number): void;

  setSettings(settings: Object): void;
}

/** The RQItemCollection contains all of the render-queue items in a project, as shown in the Render Queue panel of the project. The collection provides access to the RenderQueueItem objects, and allows you to create them from compositions. The first RenderQueueItem object in the collection is at index position 1. */
declare class RQItemCollection extends Collection {
  /** Retrieves an RenderQueueItem in the collection by its index number. The first object is at index 1. */
  [index: number]: RenderQueueItem;

  /** Adds a composition to the Render Queue. */
  add(comp: CompItem): RenderQueueItem;
}

/** The Settings object provides an easy way to manage settings for scripts. The settings are saved in the After Effects preferences file and are persistent between application sessions. Settings are identified by section and key within the file, and each key name is associated with a value. In the preferences file, section names are enclosed in brackets and quotation marks, and key names are listing in quotation marks below the section name. All values are strings. */
declare class Settings {
  /** Saves a default value for a setting. */
  saveSetting(sectionName: string, keyName: string, value: string, type?: PREFType): void;

  /** Retrieves a setting value. */
  getSetting(sectionName: string, keyName: string, type?: PREFType): string;

  /** Reports whether a specified setting is assigned. */
  haveSetting(sectionName: string, keyName: string, type?: PREFType): boolean;
}

/** The Shape object encapsulates information describing a shape in a shape layer, or the outline shape of a Mask. */
declare class Shape {
  /** When true, the shape is a closed curve. */
  closed: boolean;

  /** The anchor points of the shape. */
  vertices: [number, number][];

  /** The tangent vectors coming into the shape vertices. */
  inTangents: [number, number][];

  /** The tangent vectors coming out of the shape vertices. */
  outTangents: [number, number][];

  /** The mask path segment (sections of a mask path between vertices) containing each feather point. */
  featherSegLocs: number[];

  /** The relative position of each feather point on its mask path segment. */
  featherRelSegLocs: number[];

  /** The feather amount (radius) for each feather point. */
  featherRadii: number[];

  /** The feather radius interpolation type for each feather point. */
  featherInterps: number[];

  /** The feather tension at each feather point. */
  featherTensions: number[];

  /** The direction (inner or outer) of each feather point. */
  featherTypes: number[];

  /** The relative angle between the two normals on either side of a curved outer feather boundary at a corner on a mask path. */
  featherRelCornerAngles: number[];
}

/** The ShapeLayer object represents a shape layer within a composition. Create it using the LayerCollection object’s addShape() method. */
declare class ShapeLayer extends AVLayer {
  readonly content: PropertyGroup;
}

/** The SolidSource object represents a solid-color footage source. */
declare class SolidSource extends FootageSource {
  /** The color of the solid. */
  color: [number, number, number];
}

/** The file specification, an ExtendScript File object. */
declare class Swatch {
  /** The ASE version number. */
  majorVersion: number;

  /** The ASE version number. */
  minorVersion: number;

  /** An array of SwatchValue. */
  values: SwatchValue[];
}

/** The file specification, an ExtendScript File object. */
declare class SwatchValue {
  /** One of "RGB", "CMYK", "LAB", "Gray" */
  type: "RGB" | "CMYK" | "LAB" | "Gray";

  /** When type = "RGB", the color values in the range [0.0..1.0]. 0, 0, 0 is Black. */
  r: number;
  g: number;
  b: number;

  /** When type = "CMYK", the color values in the range [0.0..1.0]. 0, 0, 0, 0 is White. */
  c: number;
  m: number;
  y: number;
  k: number;

  /** When type = "LAB", the color values. L is in the range [0.0..1.0]. a and b are in the range [-128.0..+128.0] 0, 0, 0 is Black. */
  L: number;
  a: number;
  // b:number;

  /** When type = "Gray", the value range is [0.0..1.0]. 0.0 is Black. */
  gray: number;
  value: number;
}

/** The System object provides access to attributes found on the user’s system, such as the user name and the name and version of the operating system. It is available through the system global variable. */
declare class System {
  /** The current user name. */
  readonly userName: string;

  /** The name of the host computer. */
  readonly machineName: string;

  /** The name of the operating system. */
  readonly osName: string;

  /** The version of the operating system. */
  readonly osVersion: string;

  /** Execute’s a command on the system’s command line. */
  callSystem(cmdLineToExecute: string): string;
}

/** The TextDocument object stores a value for a TextLayer's Source Text property. Create it with the constructor, passing the string to be encapsulated. */
declare class TextDocument {
  constructor(docText: string);

  /** The text layer’s Source Text value. */
  text: string;

  /** The text layer’s font specified by its PostScript name. */
  font: string;

  /** string with path of font file, providing its location on disk (not guaranteed to be returned for all font types; return value may be empty string for some kinds of fonts) */
  readonly fontLocation: string;

  /** string with style information — e.g., “bold”, “italic” */
  readonly fontStyle: string;

  /** a string with the name of the font family */
  readonly fontFamily: string;

  /** The text layer’s font size in pixels. */
  fontSize: number;

  /** When true, the text layer shows a fill. */
  applyFill: boolean;

  /** When true, the text layer shows a stroke. */
  applyStroke: boolean;

  /** The text layer’s fill color. */
  fillColor: [number, number, number];

  /** The text layer’s stroke color. */
  strokeColor: [number, number, number];

  /** Indicates the rendering order for the fill and stroke of a text layer. */
  strokeOverFill: boolean;

  /** The text layer’s stroke thickness. */
  strokeWidth: number;

  /** The paragraph justification for the text layer. */
  justification: ParagraphJustification;

  /** The text layer’s spacing between characters. */
  tracking: number;

  /** When true, the text layer is point (unbounded) text. */
  readonly pointText: boolean;

  /** When true, the text layer is paragraph (bounded) text. */
  readonly boxText: boolean;

  /** For box text, the pixel dimensions for the text bounds. */
  boxTextSize: [number, number];

  /** CC 2014.2(13.2)- writable(24.0-) */
  fauxBold: boolean;

  /** CC 2014.2(13.2)- writable(24.0-) */
  fauxItalic: boolean;

  /** CC 2014.2(13.2)- */
  readonly allCaps: boolean;

  /** CC 2014.2(13.2)- */
  readonly smallCaps: boolean;

  /** CC 2014.2(13.2)- */
  readonly superscript: boolean;

  /** CC 2014.2(13.2)- */
  readonly subscript: boolean;

  /** CC 2014.2(13.2)- */
  readonly verticalScale: number;

  /** CC 2014.2(13.2)- */
  readonly horizontalScale: number;

  /** CC 2014.2(13.2)- */
  readonly baselineShift: number;

  /** CC 2014.2(13.2)- */
  readonly tsume: number;

  /** CC 2014.2(13.2)- */
  readonly boxTextPos: [number, number];

  /** CC 2015(13.6)- */
  readonly baselineLocs: number[];

  /** CC 2017.2(14.2)- The text layer’s spacing between lines. */
  leading: number;

  /** 24.0- The Text layer’s auto hyphenate paragraph option. If this attribute has a mixed value, it will be read as undefined. */
  autoHyphenate: boolean;

  /** 24.0- The Text layer’s auto kern type option. */
  autoKernType: AutoKernType;

  /** 24.0- The Text layer’s baseline direction option. This is significant for Japanese language in vertical texts. “BASELINE_VERTICAL_CROSS_STREAM” is also know as Tate-Chu-Yoko. */
  baselineDirection: BaselineDirection;

  /** 24.0-
    The Text layer’s paragraph composer engine option. By default new Text layers will use the ComposerEngine.UNIVERSAL_TYPE_ENGINE; the other enum value will only be encountered in projects created before the Universal Type Engine engine (formerly known as the South Asian and Middle Eastern engine) became the default in After Effects 22.1.1.

    If this attribute has a mixed value, it will be read as undefined.

    This attrribute is read-write, but an exception will be thrown if any enum value other than ComposerEngine.UNIVERSAL_TYPE_ENGINE is written.

    In effect, you can change an older document from ComposerEngine.LATIN_CJK_ENGINE to ComposerEngine.UNIVERSAL_TYPE_ENGINE, but not the reverse.
  */
  composerEngine: ComposerEngine;

  /** 24.0- The Text layer’s digit set option. */
  digitSet: DigitSet;

  /** 24.0- The Text layer’s paragraph direction option. If this attribute has a mixed value, it will be read as undefined. */
  direction: ParagraphDirection;

  /** 24.0- The Text layer’s paragraph end indent option. If this attribute has a mixed value, it will be read as undefined. */
  endIndent: number;

  /** 24.0- The Text layer’s Every-Line Composer paragraph option. If set to false, the TextDocument will use the Single-Line Composer. If this attribute has a mixed value, it will be read as undefined. */
  everyLineComposer: boolean;

  /** 24.0- The Text layer’s paragraph first line indent option. If this attribute has a mixed value, it will be read as undefined. */
  firstLineIndent: number;

  /** 24.0- The Text layer’s font baseline option. This is for setting a textDocument to superscript or subscript. */
  fontBaselineOption: FontBaselineOption;

  /** 24.0- The Text layer’s font caps option. */
  fontCapsOption: FontCapsOption;

  /** 24.0- The Text layer’s Font object specified by its PostScript name. */
  fontObject: Font;

  /** 24.0- The Text layer’s Roman Hanging Punctuation paragraph option. This is only meaningful to box Text layers—it allows punctuation to fit outside the box rather than flow to the next line. If this attribute has a mixed value, it will be read as undefined. */
  hangingRoman: boolean;

  /** 24.0-
    The Text layer’s kerning option.

    Returns zero for AutoKernType.METRIC_KERN and AutoKernType.OPTICAL_KERN.

    Setting this value will also set AutoKernType.NO_AUTO_KERN to true across the affected characters.
  */
  kerning: number;

  /** 24.0- The Text layer’s paragraph leading type option. If this attribute has a mixed value, it will be read as undefined. */
  leadingType: LeadingType;

  /** 24.0- The Text layer’s ligature option. */
  ligature: boolean;

  /** 24.0- The Text layer’s line join type option for Stroke. */
  lineJoinType: LineJoinType;

  /** 24.0- The Text layer’s no break attribute. */
  noBreak: boolean;

  /** 24.0- The Text layer’s paragraph space after option. If this attribute has a mixed value, it will be read as undefined. */
  spaceAfter: number;

  /** 24.0- The Text layer’s paragraph space before option. If this attribute has a mixed value, it will be read as undefined. */
  spaceBefore: number;

  /** 24.0- The Text layer’s paragraph start indent option. If this attribute has a mixed value, it will be read as undefined. */
  startIndent: number;

  /** 24.2- The Text layer’s line orientation, in general horizontal vs vertical, which affects how all text in the layer is composed. */
  lineOrientation: LineOrientation;

  /** 24.3- 
  Enables the automated change of the box height to fit the text content in the box. The box only grows down.

  Defaults to BoxAutoFitPolicy.NONE.

  Will be disabled if TextDocument.boxVerticalAlignment is anything other than boxVerticalAlignment.TOP.
  */
  boxAutoFitPolicy: BoxAutoFitPolicy;

  /** 24.3-
    Controls the position of the first line of composed text relative to the top of the box.

    Disabled if TextDocument.boxFirstBaselineAlignmentMinimum is anything other than zero.

    Defaults to BoxFirstBaselineAlignment.ASCENT.
  */
  boxFirstBaselineAlignment: BoxFirstBaselineAlignment;

  /** 24.3-
    Manually controls the position of the first line of composed text relative to the top of the box.

    A value set here other than zero will override the effect of the TextDocument.boxFirstBaselineAlignment value.

    Defaults to zero.
  */
  boxFirstBaselineAlignmentMinimum: number;

  /** 24.3-
    Controls the inner space between the box bounds and where the composable text box begins. The same value is applied to all four sides of the box.

    Defaults to zero.
  */
  boxInsetSpacing: number;

  /** 24.3- Returns true if some part of the text did not compose into the box. */
  readonly boxOverflow: boolean;

  /** 24.3-
    Enables the automated vertical alignment of the composed text in the box.

    Defaults to BoxVerticalAlignment.TOP
  */
  boxVerticalAlignment: BoxVerticalAlignment;

  /** 24.3-
    Returns the number of composed lines in the Text layer, may be zero if all text is overset.

    The TextDocument object instance is initialized from the composed state and subsequent changes to the TextDocument object instance does not cause recomposition.

    Even if you remove all the text from the TextDocument object instance, the value returned here remains unchanged.
  */
  readonly composedLineCount: number;

  /** 24.3- Returns the number of paragraphs in the text layer, always greater than or equal to 1. */
  readonly paragraphCount: number;

  /** Restores the default character settings in the Character panel. */
  resetCharStyle(): void;

  /** Restores the default paragraph settings in the Paragraph panel. */
  resetParagraphStyle(): void;

  /** 24.3-
    Returns an instance of the Text layer range accessor CharacterRange.

    The instance will remember the parameters passed in the constructor - they remain constant and changes to the TextDocument length may cause the instance to throw exceptions on access until the TextDocument length is changed to a length which makes the range valid again.

    Use toString() to find out what the constructed parameters were.
  */
  characterRange(characterStart: number, signedCharacterEnd?: number): CharacterRange;

  /** 24.3- Returns the character index bounds of a ComposedLineRange object in the Text layer. */
  composedLineCharacterIndexesAt(characterIndex: number): { start: number; end: number; };

  /** 24.3-
    Returns an instance of the Text layer range accessor ComposedLineRange object.

    The instance will remember the parameters passed in the constructor - they remain constant and changes to the TextDocument contents may cause the instance to throw exceptions on access until the TextDocument contents are changed which makes the range valid again.

    Use ComposedLineRange.toString() to find out what the constructed parameters were.
  */
  composedLineRange(composedLineIndexStart: number, signedComposedLineIndexEnd?: number): ComposedLineRange;

  /** 24.3- Returns the character index bounds of a paragraph in the Text layer. */
  paragraphCharacterIndexesAt(characterIndex: number): { start: number; end: number; };

  /** 24.3-
    Returns an instance of the Text layer range accessor ParagraphRange object.

    The instance will remember the parameters passed in the constructor - they remain constant and changes to the TextDocument contents may cause the instance to throw exceptions on access until the TextDocument contents are changed which makes the range valid again.

    Use ParagraphRange.toString() to find out what the constructed parameters were.
  */
  paragraphRange(paragraphIndexStart: number, signedParagraphIndexEnd?: number): ParagraphRange;
}

/** 24.3-
  The CharacterRange object is an accessor to a character range of the TextDocument object instance it was created from.

  Unlike the TextDocument object, which looks at only the first character when returning character attributes, here the character range can span zero or more characters. As a consequence, two or more characters may not have the same attribute value and this mixed state will be signaled by returning undefined.

  The characterStart attribute is the first character index of the range.

  The characterEnd attribue will report the (last + 1) character index of the range, such that (characterEnd - characterStart) represents the number of characters in the range.

  It is acceptable for most attributes for the effective range to be zero - otherwise known as an insertion point.

  When accessed, the CharacterRange object will check that characterStart and effective characterEnd of the range remains valid for the current span of the related TextDocument object. This is the same rule as applied when the CharacterRange was created, but because the length of the related TextDocument object can change through the addition or removal of characters, the characterStart and effective characterEnd may no longer be valid. In this situation an exception will be thrown on access, either read or write. The isRangeValid attribute will return false if the effective range is no longer valid.

  Note that if the TextDocument object length changes, the CharacterRange object range could become valid again.
*/
declare class CharacterRange {
  /**
    The Text layer range calculated character end value.

    Throws an exception on access if the effective value would exceed the bounds of the related TextDocument object.
  */
  readonly characterEnd: number;

  /**
    The Text layer range calculated character start value.

    Throws an exception on access if the effective value would exceed the bounds of the related TextDocument object.
  */
  readonly characterStart: number;

  /**
    The Text layer range CharacterRange attribute Fill Color, as an array of [r, g, b] floating-point values.

    For example, in an 8-bpc project, a red value of 255 would be 1.0, and in a 32-bpc project, an overbright blue value can be something like 3.2.

    Setting this value will also set applyFill to true across the affected characters.

    If this attribute has a mixed value for the range of characters, it will be read as undefined.
  */
  fillColor: [r: number, g: number, b: number];

  /** Returns true if the current range is within the bounds of the related TextDocument object, false otherwise. */
  readonly isRangeValid: boolean;

  /**
    The Text layer range character attribute kerning option.

    This effectively reports the manual kerning value, and not the calculated kerning value from auto kerning.

    If autoKernType in the range is set to AutoKernType.METRIC_KERN, AutoKernType.OPTICAL_KERN, or is mixed, then this attribute will be returned as undefined.

    If autoKernType in the range is set to AutoKernType.NO_AUTO_KERN, and this attribute has a mixed value, it will be read as undefined.

    Setting this value will also set AutoKernType.NO_AUTO_KERN to true across the affected characters.
  */
  kerning: AutoKernType;

  /**
    The Text layer CharacterRange stroke color character property, as an array of [r, g, b] floating-point values.

    For example, in an 8-bpc project, a red value of 255 would be 1.0, and in a 32-bpc project, an overbright blue value can be something like 3.2.

    If this attribute has a mixed value, it will be read as undefined.

    Setting this value will also set applyStroke to true across the affected characters.
  */
  strokeColor: [r: number, g: number, b: number];

  /**
    The Text layer CharacterRange Stroke Over Fill character property.

    Indicates the rendering order for the fill and stroke for characters in the range. When true, the stroke appears over the fill.

    If this attribute has a mixed value, it will be read as undefined.
  */
  strokeOverFill: boolean;

  /**
    The text value for the Text layer range.

    On read, the same number of characters as the span of the range will be returned. If the span is zero (an insertion point) it return an empty string.

    On write, the characters in the range will be replaced with whatever string value is supplied. If an empty string, then the characters in the range will be effectively deleted.

    To insert characters without deleting any existing, call TextDocument.characterRange() with the same value for start as end to get an insertion point range.
  */
  text: string;

  /**
    Returns a string with the parameters used to create the CharacterRange instance, e.g. "CharacterRange(0,-1)".

    This may be safely called on an instance where isRangeValid returns false.
  */
  toString(): string;
}

/** 24.3-
  The ParagraphRange object is an accessor to a paragraph range of the TextDocument object instance it was created from.

  The characterStart attribute will report the first character index of the range.

  The characterEnd attribute will report the (last + 1) character index of the range, such that (characterEnd - characterStart) represents the number of characters in the range.

  The only time these two properties will equal will on an empty last paragraph of the TextDocument object.

  When accessed, the ParagraphRange object will check that effective characterStart and effective characterEnd of the range remains valid for the current span of the related TextDocument object. This is the same rule as applied when the ParagraphRange was created, but because the length of the related TextDocument object can change through the addition or removal of characters, the effective characterStart and effective characterEnd may no longer be valid. In this situation an exception will be thrown on access, either read or write. The isRangeValid attribute will return false if the effective range is no longer valid.

  Note that if the TextDocument object length changes, the character range could become valid again.

  As a convenience, the function ParagraphRange.characterRange() can be invoked which will return a CharacterRange object instance initialized from characterStart and characterEnd. This instance becomes independent of the ParagraphRange instance it came from so subsequent changes to the ParagraphRange limits are not communicated to the CharacterRange object instance.

  For performance reasons, when accessing multiple attributes it is adviseable to retrieve the CharacterRange object once and re-use it rather than create a new one each time.
*/
declare class ParagraphRange {
  /**
    The Text layer range calculated character end value.

    Throws an exception on access if the effective value would exceed the bounds of the related TextDocument object.
  */
  readonly characterEnd: number;

  /**
    The Text layer range calculated character start value.

    Throws an exception on access if the effective value would exceed the bounds of the related TextDocument object.
  */
  readonly characterStart: number;

  /** Returns true if the current range is within the bounds of the related TextDocument object, false otherwise. */
  readonly isRangeValid: boolean;

  /**
    Returns a CharacterRange object initialized from characterStart and characterEnd.

    Will throw an exception if isRangeValid would return false.

    The returned instance, once created, is independent of subsequent changes to the ParagraphRange it came from.
  */
  characterRange(): CharacterRange;
}

/** 24.3-
   The ComposedLineRange object is an accessor to a composed line range of the TextDocument object instance it was created from.

  Composed lines are initialized in the TextDocument object when it is created and remain unchanged while the TextDocument object is changed. It is important to note that the TextDocument object instance is not re-composed when changes are made to it - that only occurs when the instance is applied back to a TextLayer object. So if you delete all the text in the TextDocument object instance the number of composed lines will remain constant.

  The characterStart attribute will report the first character index of the range.

  The characterEnd attribute will report the (last + 1) character index of the range, such that (characterEnd - characterStart) represents the number of characters in the range.

  A composed line always has some length.

  When accessed, the ComposedLineRange object will check that effective characterStart and effective characterEnd of the range remains valid for the current span of the related TextDocument object. This is the same rule as applied when the ComposedLineRange was created, but because the length of the related TextDocument object can change through the addition or removal of characters, the effective characterStart and effective characterEnd may no longer be valid. In this situation an exception will be thrown on access, either read or write. The property isRangeValid will return false if the effective range is no longer valid.

  Note that if the TextDocument object length changes, the character range could become valid again.

  As a convenience, the function ComposedLineRange.characterRange() can be invoked which will return a CharacterRange object instance initialized from characterStart and characterEnd. This instance becomes independent of the ComposedLineRange instance it came from so subsequent changes to the ComposedLineRange limits are not communicated to the CharacterRange object instance.

  For performance reasons, when accessing multiple attributes it is adviseable to retrieve the CharacterRange object once and re-use it rather than create a new one each time.
*/
declare class ComposedLineRange  {
  /**
    The Text layer range calculated character end value.

    Throws an exception on access if the effective value would exceed the bounds of the related TextDocument object.
  */
  readonly characterEnd: number;

  /**
    The Text layer range calculated character start value.

    Throws an exception on access if the effective value would exceed the bounds of the related TextDocument object.
  */
  readonly characterStart: number;

  /** Returns true if the current range is within the bounds of the related TextDocument object, false otherwise. */
  readonly isRangeValid: boolean;

  /**
    Returns a CharacterRange object initialized from characterStart and characterEnd.

    Will throw an exception if isRangeValid would return false.

    The returned instance, once created, is independent of subsequent changes to the ComposedLineRange it came from.
  */
  characterRange(): CharacterRange;
}

/** The TextLayer object represents a text layer within a composition. Create it using the LayerCollection object’s addText method. */
declare class TextLayer extends AVLayer {
  readonly source: null;

  readonly text: _TextProperties;
}

/** The Viewer object represents a Composition, Layer, or Footage panel. */
declare class Viewer {
  /** The type of content in the viewer. */
  readonly type: ViewerType;

  /** When true, the viewer is focused. */
  readonly active: boolean;

  activeViewIndex: number;

  readonly views: View[];

  /** When true, the viewer is at its maximized size. */
  maximized: boolean;

  /** Moves the viewer to front and places focus on it. */
  setActive(): boolean;
}

declare class View {
  readonly active: boolean;

  readonly options: ViewOptions;

  setActive(): void;
}

declare class ViewOptions {
  channels: ChannelType;

  checkerboards: boolean;

  exposure: number;

  fastPreview: FastPreviewType;

  zoom: number;

  /** CC 2019(16.1)-*/
  guidesLocked: boolean;

  /** CC 2019(16.1)-*/
  guidesSnap: boolean;

  /** CC 2019(16.1)-*/
  guidesVisibility: boolean;

  /** CC 2019(16.1)-*/
  rulers: boolean;
}

/** 24.0- 
  The Fonts objects provides information about the current font ecosystem on your device.

  After Effects maintains an internal font proxy to a real font which it has enumerated in the font ecosystem. As the fonts in the font ecosystem are added and removed these internal font proxies are kept in sync as well by being added and removed.

  The properties we report via the proxy Font object are the data that is available to us from the font files themselves, which of course will vary according to technology and type of font. It is not possible here to describe all the possible interesting variations and troubles that this causes us and in general it is advisable to be careful with assuming that the behavior and properties for one font type or technology are common to all other font types and technology - the answer as always is “it depends”.

  A Font object is a soft reference to one of these internal font proxies and as a consequence is not sufficient to keep the internal font proxy alive. As a result if the internal font proxy is removed, the referencing Font object will throw an invalid exception for any property reference.

  On project open, and a few other situations, it may come to pass that the font which is being referenced in the persisted data cannot be found in the current font ecosystem. In these situations an internal font proxy will be created which will contain the desired properties, such as PostScript name, and will return true for isSubstitute. There will be an underlying real font which will be selected to support this internal font proxy, but we do not reveal what it is and there is no way to influence this selection.

  Continuing the open process with created substitute fonts, an attempt will be made to sync matching fonts from Creative Cloud Adobe Fonts. This is an asynchronous activity and the project will usually finish opening and be ready for use before any fonts are brought down from Adobe Fonts. Depending on how many fonts are being synced, they may be installed at different times. There is no way to disable this attempt.

  After any change to the font ecosystem from installing new real fonts, the outstanding list of substitute fonts will be evaluated to see if there now exists a real font which is a valid replacement for it - currently only requiring the PostScript name to match - and if one is found automatically all the references in the project to the substitute will be replaced with the newly installed font.
*/
declare class Fonts {
  /**
    The list of all the fonts currently available on your system.

    They are grouped into what is named a family group which are Arrays of Font object.

    The Family Name of the group is simply the familyName of any of the Font objects in the group.

    The Family Name in one font group is not guaranteed to have unique name compared to different font groups - the grouping is determined by a number of factors including the returned value of FontObject.technology and FontObject.writingScripts.

    In addition, it is perfectly acceptable to have multiple fonts with the same PostScript name, though only one will have the same (PostScript name, Technology, Primary Writing Script) tuple. In the case of true duplicates, it is undefined which will be returned and which will be suppressed.

    The family groups and Font objects in the group are sorted according to the setting in the Character Panel dropdown “Show Font Names in English”. If set to true, the familyName and styleName property is used, otherwise the nativeFamilyName and nativeStyleName property is used.

    Font object for which isSubstitute returns true are always sorted to the end as individual family groups.
  */
  readonly allFonts: Font[][];

  /** Returns an array of variable Font objects, each using a unique font dictionary and with default values for their design axes. This API is a convenient way to quickly filter for a unique instance of each installed variable font.*/
  readonly fontsWithDefaultDesignAxes: Font[];

  /** The list of all the missing or substituted fonts of the current Project. */
  readonly missingOrSubstitutedFonts: Font[];

  /** 24.2-
    Returns an unsigned number representing the current revision of the font environment.

    The revision is advanced when anything happens to the font environment which would change the contents, properties, or order of Font objects returned from a call to FontsObject.allFonts.

    Among these are: installing or removing fonts in the font environment, opening or closing a project with substituted fonts, causing a custom Variable font instance to be created, and changing the setting in the Character Panel dropdown “Show Font Names in English”.
  */
  readonly fontServerRevision: number;

  /** This function will return an array of Font object based on the Family Name and Style Name of a font. If no suitable font is found, it will return an empty Array. */
  getFontsByFamilyNameAndStyleName(familyName: string, styleName: number): Font[];

  /**
    This function will return an array of Font objects based on the PostScript name of previously found Fonts.

    It is perfectly valid to have multiple Font objects which share the same PostScript name, the order of these is determined by the order in which they were enumerated in the font environment. The entry at [0] will be used when setting the TextDocument.fontObject property.

    In addition, there is a special property of this API with regards to Variable fonts. If no Font object matching the requested PostScript exists, but we find that there exist a variable font which matches the requested PostScript name prefix, then this Variable font instance will be requested to create a matching Font object. This is the only way that we will return an instance which did not exist prior to invoking this method.

    If no matching font is found, it will return an empty Array.
  */
  getFontsByPostScriptName(postscriptName: string): Font[];
  
  /** 24.2-
    This function will return an instance of Font object based on the ID of a previously found font.

    If no matching font is found, it will return undefined. This can occur with an unknown ID or if the original font has been removed from the font environment.
  */
  getFontByID(fontID: number): Font | undefined;
}

/** 24.0-
    The Font object provides information about a specific font, along with the font technology used, helping disambiguate when multiple fonts sharing the same Postscript name are installed on the system.

    Most of these APIs simply return information which is contained in the Font data file itself, seek more information there.
*/
declare class Font {
  /** Returns an Array of Objects, containing the design axes data from the font. Each object is composed of the axis name, tag, min value and max value. */
  readonly designAxesData: { name: string; tag: number; min: number; max: number; }[];

  /** For Variable fonts will return an ordered array with a length matching the number of design axes defined by the font. */
  readonly designVector: number[];

  /** The family name of the font, in the ASCII character set. */
  readonly familyName: string;

  /** The family prefix of the variable font. For example, the family of the PostScript name “SFPro-Bold” is “SFPro”. */
  readonly familyPrefix: string;

  /** 24.2- 
    A unique number assigned to the FontObject instance when it is created, value is greater than or equal to 1. It never changes during the application session but may be different in subsequent launches of the application.

    Can be used to compare two FontObject instances to see if they refer to the same underlying native font instance.

    FontObjects can be looked up by fontID with getFontByID .
  */
  readonly fontID: number;

  /** The full name of the font, in the ASCII character set. Usually composed of the family name and the style name. */
  readonly fullName: string;

  /** Returns true if the font is a variable font. */
  readonly hasDesignAxes: boolean;

  /** Returns true if the font is from Adobe Fonts. */
  readonly isFromAdobeFonts: boolean;

  /** Returns true when this font instance represents a font reference which was missing on project open. */
  readonly isSubstitute: boolean;

  /** The location of the font file on your system. */
  readonly location: string;

  /** The native family name of the font in full 16 bit Unicode. Often different than what is returned by FontObject.familyName for non-Latin fonts. */
  readonly nativeFamilyName: string;

  /** The native full name of the font in full 16 bit Unicode. Often different than what is returned by FontObject.fullName for non-Latin fonts. */
  readonly nativeFullName: string;

  /** The native style name of the font in full 16 bit Unicode. Often different than what is returned by FontObject.styleName for non-Latin fonts. */
  readonly nativeStyleName: string;

  /** The postscript name of the font. */
  readonly postScriptName: string;

  /** The style name of the font, in the ASCII character set. */
  readonly styleName: string;

  /** The technology used by the font. */
  readonly technology: CTFontTechnology;

  /** The internal type of the font. */
  readonly type: CTFontType;

  /** The version number of the font. */
  readonly version: string;

  /** The supported character sets of the font. */
  readonly writingScripts: CTScript[];

  /** This function will true if the Font object passed as an argument shares the same variable font dictionnary as the Font object the function is called on. */
  hasSameDict(fontObject: Font): boolean;

  /** This function will return the postscript name of the variable font for the specific design vectors passed as the argument. */
  postScriptNameForDesignVector(vectorValues: number[]): string;
}

/*
* Properties for Shortcuts
*/
declare class _TransformGroup extends PropertyGroup {
  readonly pointOfInterest: Property;
  readonly anchorPoint: Property;
  readonly position: Property;
  readonly xPosition: Property;
  readonly yPosition: Property;
  readonly zPosition: Property;
  readonly scale: Property;
  readonly orientation: Property;
  readonly rotation: Property;
  readonly xRotation: Property;
  readonly yRotation: Property;
  readonly zRotation: Property;
  readonly opacity: Property;
}

declare class _LightOptionsGroup extends PropertyGroup {
  readonly intensity: Property;
  readonly color: Property;
  readonly coneAngle: Property;
  readonly coneFeather: Property;
  readonly falloff: Property;
  readonly radius: Property;
  readonly falloffDistance: Property;
  readonly castsShadows: Property;
  readonly shadowDarkness: Property;
  readonly shadowDiffusion: Property;
}

declare class _CameraOptionsGroup extends PropertyGroup {
  readonly zoom: Property;
  readonly depthOfField: Property;
  readonly focusDistance: Property;
  readonly aperture: Property;
  readonly blurLevel: Property;
  readonly irisShape: Property;
  readonly irisRotation: Property;
  readonly irisRoundness: Property;
  readonly irisAspectRatio: Property;
  readonly irisDiffractionFringe: Property;
  readonly highlightGain: Property;
  readonly highlightThreshold: Property;
  readonly highlightSaturation: Property;
}

declare class _LayerStyles extends PropertyGroup {
  readonly blendingOption: _BlendOptionsGroup;
  readonly dropShadow: _DropShadow;
  readonly innerShadow: _InnerShadow;
  readonly outerGlow: _OuterGlow;
  readonly innerGlow: _InnerGlow;
  readonly bevelAndEmboss: _BevelAndEmboss;
  readonly satin: _Satin;
  readonly colorOverlay: _ColorOverlay;
  readonly gradientOverlay: _GradientOverlay;
  readonly stroke: _Stroke;
}

declare class _BlendOptionsGroup extends PropertyGroup {
  readonly globalLightAngle: Property;
  readonly globalLightAltitude: Property;
  readonly advancedBlending: _AdvBlendGroup;
}

declare class _AdvBlendGroup extends PropertyGroup {
  readonly fillOpacity: Property;
  readonly red: Property;
  readonly green: Property;
  readonly blue: Property;
  readonly blendInteriorStylesAsGroup: Property;
  readonly useBlendRangesFromSource: Property;
}

declare class _DropShadow extends PropertyGroup {
  readonly blendMode: Property;
  readonly color: Property;
  readonly opacity: Property;
  readonly useGlobalLight: Property;
  readonly angle: Property;
  readonly distance: Property;
  readonly spread: Property;
  readonly size: Property;
  readonly noise: Property;
  readonly layerKnocksOutDropShadow: Property;
}

declare class _InnerShadow extends PropertyGroup {
  readonly blendMode: Property;
  readonly color: Property;
  readonly opacity: Property;
  readonly useGlobalLight: Property;
  readonly angle: Property;
  readonly distance: Property;
  readonly choke: Property;
  readonly size: Property;
  readonly noise: Property;
}

declare class _OuterGlow extends PropertyGroup {
  readonly blendMode: Property;
  readonly opacity: Property;
  readonly noise: Property;
  readonly colorType: Property;
  readonly color: Property;
  readonly colors: Property;
  readonly gradientSmoothness: Property;
  readonly technique: Property;
  readonly spread: Property;
  readonly size: Property;
  readonly range: Property;
  readonly jitter: Property;
}

declare class _InnerGlow extends PropertyGroup {
  readonly blendMode: Property;
  readonly opacity: Property;
  readonly noise: Property;
  readonly colorType: Property;
  readonly color: Property;
  readonly colors: Property;
  readonly gradientSmoothness: Property;
  readonly technique: Property;
  readonly source: Property;
  readonly choke: Property;
  readonly size: Property;
  readonly range: Property;
  readonly jitter: Property;
}

declare class _BevelAndEmboss extends PropertyGroup {
  readonly style: Property;
  readonly technique: Property;
  readonly depth: Property;
  readonly direction: Property;
  readonly size: Property;
  readonly soften: Property;
  readonly useGlobalLight: Property;
  readonly angle: Property;
  readonly altitude: Property;
  readonly highlightMode: Property;
  readonly highlightColor: Property;
  readonly highlightOpacity: Property;
  readonly shadowMode: Property;
  readonly shadowColor: Property;
  readonly shadowOpacity: Property;
}

declare class _Satin extends PropertyGroup {
  readonly blendMode: Property;
  readonly color: Property;
  readonly opacity: Property;
  readonly angle: Property;
  readonly distance: Property;
  readonly size: Property;
  readonly invert: Property;
}

declare class _ColorOverlay extends PropertyGroup {
  readonly blendMode: Property;
  readonly color: Property;
  readonly opacity: Property;
}

declare class _GradientOverlay extends PropertyGroup {
  readonly blendMode: Property;
  readonly opacity: Property;
  readonly colors: Property;
  readonly gradientSmoothness: Property;
  readonly angle: Property;
  readonly style: Property;
  readonly reverse: Property;
  readonly alignWithLayer: Property;
  readonly scale: Property;
  readonly offset: Property;
}

declare class _Stroke extends PropertyGroup {
  readonly color: Property;
  readonly blendMode: Property;
  readonly size: Property;
  readonly opacity: Property;
  readonly position: Property;
}

declare class _GeometryOptionsGroup extends PropertyGroup {
  readonly curvature: Property;
  readonly segments: Property;

  readonly bevelStyle: Property;
  readonly bevelDepth: Property;
  readonly holeBevelDepth: Property;
  readonly extrusionDepth: Property;
}

declare class _MaterialOptionsGroup extends PropertyGroup {
  readonly castsShadows: Property;
  readonly lightTransmission: Property;
  readonly acceptsShadows: Property;
  readonly acceptsLights: Property;
  readonly appearsInReflections: Property;
  readonly ambient: Property;
  readonly diffuse: Property;
  readonly specularIntensity: Property;
  readonly specularShininess: Property;
  readonly metal: Property;
  readonly reflectionIntensity: Property;
  readonly reflectionSharpness: Property;
  readonly reflectionRolloff: Property;
  readonly transparency: Property;
  readonly transparencyRolloff: Property;
  readonly indexOfRefraction: Property;
}

declare class _AudioGroup extends PropertyGroup {
  readonly audioLevels: Property;
}

declare class _TextProperties extends PropertyGroup {
  readonly sourceText: Property;
  readonly pathOption: _TextPathOptions;
  readonly moreOption: _TextMoreOptions;
  readonly animator: PropertyGroup;
}

declare class _TextPathOptions extends PropertyGroup {
  readonly path: Property;
}

declare class _TextMoreOptions extends PropertyGroup {
  readonly anchorPointGrouping: Property;
  readonly groupingAlignment: Property;
  readonly fillANdStroke: Property;
  readonly interCharacterBlending: Property;
}
