declare const enum AppVersion {
  CS3 = 8.0,
  CS4 = 9.0,
  CS5 = 10.0,
  CS5_5 = 10.5,
  CS6 = 11.0,
  CC = 12.0,
  CC2014 = 13.0,
  CC2015 = 13.5,
  CC2015_1 = 13.6,
  CC2015_2 = 13.7,
  CC2015_3 = 13.8,
  CC2017 = 14.0,
  CC2017_2 = 14.2,
  CC2018 = 15.0,
  CC2018_2 = 15.1,
  CC2019 = 16.0,
  CC2020 = 17.0,
  CC2021 = 18.0,
  CC2022 = 22.0,
  CC2023 = 23.0,
}

declare const enum CommandID {
  /*
  * File
  */
  NewProject = 2,
  NewFolder = 2139,
  NewAdobePhotoshopFile = 3147,
  NewMAXONCINEMA4DFile = 4007,
  OpenProject = 3,
  OpenRecentProject1 = 2330,
  OpenRecentProject2 = 2331,
  OpenRecentProject3 = 2332,
  OpenRecentProject4 = 2333,
  OpenRecentProject5 = 2334,
  BrowseInBridge = 3689,

  Close = 4,
  CloseProject = 3154,
  Save = 5,
  SaveAs = 6,
  SaveACopy = 2166,
  SaveACopyAsXML = 3785,
  IncrementAndSave = 3088,
  Revert = 7,

  ImportFile = 2003,
  ImportMultipleFiles = 2236,
  ImportPlaceholder = 2126,
  ImportSolid = 3000,
  ImportRecentFootage1 = 2310,
  ImportRecentFootage2 = 2311,
  ImportRecentFootage3 = 2312,
  ImportRecentFootage4 = 2313,
  ImportRecentFootage5 = 2314,
  ImportRecentFootage6 = 2315,
  ImportRecentFootage7 = 2316,
  ImportRecentFootage8 = 2317,
  ImportRecentFootage9 = 2318,
  ImportRecentFootage10 = 2319,
  ExportAddToAdobeMediaEncoderQueue = 3800,
  ExportAddToRenderQueue = 2161,

  AddFootageToComp = 2005,
  NewCompFromSelection = 2796,

  CollectFiles = 2482,
  ConsolidateAllFootage = 2107,
  RemoveUnsedFootage = 2109,
  ReduceProject = 2735,
  FindMissingEffects = 4002,
  FindMissingFonts = 4003,
  FindMissingFootage = 4004,
  WatchFolder = 2457,

  RunScriptFile = 8000,
  OpenScriptEditor = 8001,

  CreateProxyStill = 2778,
  CreateProxyMovie = 2779,
  SetProxyFile = 2003,
  SetProxyNone = 2119,
  InterpretFootageMain = 2077,
  InterpretFootageProxy = 2103,
  InterpretFootageRememberInterpretation = 2254,
  InterpretFootageApplyInterpretation = 2255,
  ReplaceFootageFile = 2003,
  ReplaceFootageWithLayeredComp = 3070,
  ReplaceFootagePlaceholder = 2126,
  ReplaceFootageSolid = 3000,
  ReloadFootage = 2257,
  RevealInExploler = 2562,
  RevealInFinder = 2562,
  RevealInBridge = 3690,

  ProjectSettings = 2611,

  /*
  * Edit
  */
  Undo = 16,
  Redo = 17,

  Cut = 18,
  Copy = 19,
  CopyWithPropertyLinks = 10310,
  CopyExpressionOnly = 53,
  Paste = 20,
  Clear = 21,

  Duplicate = 2080,
  SplitLayer = 2158,
  LiftWorkArea = 2613,
  ExtractWorkArea = 2614,
  SelectAll = 23,
  DeselectAll = 2004,

  PurgeAllMemoryAndDiskCache = 10200,
  PurgeAllMemory = 2373,
  PurgeUndo = 2371,
  PurgeImageCacheMemory = 2372,
  PurgeSnapshot = 2481,

  EditOriginal = 2142,
  EditInAdobeAudition = 3697,

  TemplatesRenderSettings = 2149,
  TemplatesOutputModule = 2150,
  PasteMochaMask = 5006,

  /*
  * Composition
  */
  NewComposition = 2000,

  CompositionSettings = 2007,
  SetPosterTime = 2012,
  TrimCompToWorkArea = 2360,
  CropCompToRegionOfInterest = 2997,
  AddToAdobeMediaEncoderQueue = 3800,
  AddToRenderQueue = 2161,
  AddOutputModule = 2154,

  SaveFrameAs = 2233,
  SaveFrameAsPhotoshopLayers = 5001,
  PreRender = 2780,

  CompositionFlowchart = 2258,
  CompositionMiniFlowchart = 3792,

  /*
  * Layer
  */
  NewText = 2836,
  NewSolid = 2038,
  NewLight = 2563,
  NewCamera = 2564,
  NewNullObject = 2767,
  NewShapeLayer = 3736,
  NewAdjustmentLayer = 2279,
  //NewAdobePhotoshopFile = 3147,
  //NewMAXONCINEMA4DFile = 4007,
  LayerSettings = 2021,

  OpenLayer = 3784,
  OpenLayerSource = 2523,
  //RevealInExploler = 2562,
  //RevealInFinder = 2562,

  NewMask = 2367,
  ResetMask = 2448,
  RemoveMask = 2368,
  RemoveAllMasks = 2369,
  UnlockAllMasks = 2456,
  LockOtherMasks = 2455,
  HideLockedMasks = 2524,

  QualityBest = 2045,
  QualityDraft = 2044,
  QualityWireframe = 2042,
  QualityBilinear = 10207,
  QualityBicubic = 10208,

  HideOtherVideo = 2054,
  ShowAllVideo = 2055,
  UnlockAllLayers = 2244,

  FlipHorizontal = 3766,
  FlipVertical = 3767,
  CenterInView = 3819,
  CenterAnchorPointInLayerContent = 10312,
  FitToComp = 2156,
  FitToCompWidth = 2732,
  FitToCompHeight = 2733,
  EnableTimeRemapping = 2153,
  TimeReverseLayer = 2135,
  TimeStretch = 2024,
  FreezeFrame = 3695,
  AddMarker = 2157,

  LayerStylesConvertToEditableStyles = 3740,
  LayerStylesShowAll = 3743,
  LayerStylesRemoveAll = 2072,
  LayerStylesDropShadow = 9000,
  LayerStylesInnerShadow = 9001,
  LayerStylesOuterGlow = 9002,
  LayerStylesInnerGlow = 9003,
  LayerStylesBevelAndEmboss = 9004,
  LayerStylesSatin = 9005,
  LayerStylesColorOverlay = 9006,
  LayerStylesGradientOverlay = 9007,
  LayerStylesStroke = 9008,

  GroupShapes = 3741,
  UngroupShapes = 3742,

  ConvertToEditableText = 3799,
  CreateShapesFromText = 3781,
  CreateMasksFromText = 2933,
  CreateShapesFromVectorLayer = 3973,
  CreateStereo3DRig = 3843,
  CreateOrbitNull = 3844,
  LinkFocusDistanceToPointOfInterest = 3845,
  LinkFocusDistanceToLayer = 3847,
  SetFocusDitanceToLayer = 3846,
  AutoTrace = 3044,
  PreCompose = 2071,

  /*
  * Animation
  */
  SaveAnimationPreset = 3075,
  ApplyAnimationPreset = 2450,
  RecentAnimationPreset1 = 2460,
  RecentAnimationPreset2 = 2461,
  RecentAnimationPreset3 = 2462,
  RecentAnimationPreset4 = 2463,
  RecentAnimationPreset5 = 2464,
  BrowsePresets = 3691,

  ConvertAudioToKeyframes = 5015,
  ConvertExpressionToKeyframes = 2639,
  RPFCameraImport = 5018,
  SequenceLayers = 5003,
  TimeReverseKeyframes = 3693,

  RemoveAllTextAnimators = 3058,

  AddExpression = 2702,
  SeparateDimensions = 3764,
  TrackCamera = 3983,
  TrackInMochaAE = 5007,
  WarpStabilizerVFX = 3986,
  TrackMotion = 2568,
  TrackMask = 10311,
  TrackThisProperty = 2643,

  RevealPropertiesWithKeyframes = 2387,
  RevealPropertiesWithAnimation = 4011,
  RevealAllModifiedProperties = 2771,

  /*
  * View
  */
  ZoomIn = 2092,
  ZoomOut = 2093,

  ResolutionFull = 2048,
  ResolutionHalf = 2047,
  ResolutionThird = 2081,
  ResolutionQuarter = 2046,
  ResolutionCustom = 2049,

  UseDisplayColorManagement = 3704,

  ShowRulers = 2280,

  ShowGuides = 2274,
  SnapToGuides = 2286,
  LockGuides = 2275,
  ClearGuides = 2276,

  ShowGrid = 2277,
  SnapToGrid = 2278,

  ShowLayerControls = 2435,

  /*
  * Window
  */
  Align = 5022,
  Audio = 2029,
  Brushed = 3014,
  Character = 3011,
  EffectsAndPresets = 3718,
  Info = 2028,
  MaskInterpolation = 5027,
  MediaBrowser = 4013,
  Metadata = 3788,
  MotionSketch = 5024,
  Paint = 3045,
  Paragraph = 3012,
  Preview = 2031,
  Progress = 4005,
  Smoother = 5028,
  Tools = 2010,
  Tracker = 5005,
  Wiggler = 5030,
}

declare enum Language {
  ENGLISH,
  JAPANESE,
  GERMAN,
  FRENCH,
  ITALIAN,
  SPANISH,
  KOREAN,
  CHINESE,
  RUSSIAN,
  PORTUGUESE,
}

declare enum PurgeTarget {
  /** Purges all data that After Effects has cached to physical memory. */
  ALL_CACHES,
  /** Purges all data saved in the undo cache. */
  UNDO_CACHES,
  /** Purges all data cached as composition/layer snapshots. */
  SNAPSHOT_CACHES,
  /** Purges all saved image data. */
  IMAGE_CACHES
}


declare enum FrameBlendingType {
  FRAME_MIX,
  NO_FRAME_BLEND,
  PIXEL_MOTION
}

declare enum BlendingMode {
  ADD,
  ALPHA_ADD,
  CLASSIC_COLOR_BURN,
  CLASSIC_COLOR_DODGE,
  CLASSIC_DIFFERENCE,
  COLOR,
  COLOR_BURN,
  COLOR_DODGE,
  DANCING_DISSOLVE,
  DARKEN,
  DARKER_COLOR,
  DIFFERENCE,
  DISSOLVE,
  EXCLUSION,
  HARD_LIGHT,
  HARD_MIX,
  HUE,
  LIGHTEN,
  LIGHTER_COLOR,
  LINEAR_BURN,
  LINEAR_DODGE,
  LINEAR_LIGHT,
  LUMINESCENT_PREMUL,
  LUMINOSITY,
  MULTIPLY,
  NORMAL,
  OVERLAY,
  PIN_LIGHT,
  SATURATION,
  SCREEN,
  SILHOUETE_ALPHA,
  SILHOUETTE_LUMA,
  SOFT_LIGHT,
  STENCIL_ALPHA,
  STENCIL_LUMA,
  VIVID_LIGHT
}

declare enum TrackMatteType {
  ALPHA,
  ALPHA_INVERTED,
  LUMA,
  LUMA_INVERTED,
  NO_TRACK_MATTE
}

declare enum LayerQuality {
  BEST,
  DRAFT,
  WIREFRAME
}

declare enum AutoOrientType {
  /** Layer faces in the direction of the motion path. */
  ALONG_PATH,
  /** Layer always faces the active camera or points at its point of interest. */
  CAMERA_OR_POINT_OF_INTEREST,
  /** Each character in a per-character 3D text layer automatically faces the active camera. */
  CHARACTERS_TOWARD_CAMERA,
  /** Layer rotates freely, independent of any motion path, point of interest, or other layers. */
  NO_AUTO_ORIENT
}

declare enum LayerSamplingQuality {
  BICUBIC,
  BILINEAR
}

declare enum AlphaMode {
  IGNORE,
  STRAIGHT,
  PREMULTIPLIED
}

declare enum FieldSeparationType {
  OFF,
  UPPER_FIELD_FIRST,
  LOWER_FIELD_FIRST
}

declare enum PulldownPhase {
  OFF,
  SSWWW,
  SWWWS,
  SWWWW_24P_ADVANCE,
  WSSWW,
  WSWWW_24P_ADVANCE,
  WWSSW,
  WWSWW_24P_ADVANCE,
  WWWSS,
  WWWSW_24P_ADVANCE,
  WWWWS_24P_ADVANCE
}

declare enum PulldownMethod {
  PULLDOWN_3_2,
  ADVANCE_24P
}

declare enum ImportAsType {
  COMP_CROPPED_LAYERS,
  FOOTAGE,
  COMP,
  PROJECT
}

declare enum LightType {
  PARALLEL,
  SPOT,
  POINT,
  AMBIENT
}

declare enum MaskMode {
  NONE,
  ADD,
  SUBTRACT,
  INTERSECT,
  LIGHTEN,
  DARKEN,
  DIFFERENCE
}

declare enum MaskMotionBlur {
  SAME_AS_LAYER,
  ON,
  OFF
}

declare enum MaskFeatherFalloff {
  FFO_LINEAR,
  FFO_SMOOTH
}

declare enum PostRenderAction {
  NONE,
  IMPORT,
  IMPORT_AND_REPLACE_USAGE,
  SET_PROXY
}

declare enum GetSettingsFormat {
  STRING,
  STRING_SETTABLE,
  NUMBER,
  NUMBER_SETTABLE,
  SPEC
}

declare enum TimeDisplayType {
  FRAMES,
  TIMECODE
}

declare enum FootageTimecodeDisplayStartType {
  FTCS_START_0,
  FTCS_USE_SOURCE_MEDIA
}

declare enum FeetFramesFilmType {
  MM16,
  MM35
}

declare enum FramesCountType {
  FC_START_0,
  FC_START_1,
  FC_TIMECODE_CONVERSION
}

declare enum CloseOptions {
  /** Close without saving. */
  DO_NOT_SAVE_CHANGES,
  /** Prompt for whether to save changes before close. */
  PROMPT_TO_SAVE_CHANGES,
  /** Save automatically on close. */
  SAVE_CHANGES
}

declare enum PropertyValueType {
  NO_VALUE,
  ThreeD_SPATIAL,
  ThreeD,
  TwoD_SPATIAL,
  TwoD,
  OneD,
  COLOR,
  CUSTOM_VALUE,
  MARKER,
  LAYER_INDEX,
  MASK_INDEX,
  SHAPE,
  TEXT_DOCUMENT
}

declare enum KeyframeInterpolationType {
  LINEAR,
  BEZIER,
  HOLD
}

declare enum PropertyType {
  PROPERTY,
  INDEXED_GROUP,
  NAMED_GROUP
}

declare enum RQItemStatus {
  WILL_CONTINUE,
  NEEDS_OUTPUT,
  UNQUEUED,
  QUEUED,
  RENDERING,
  USER_STOPPED,
  ERR_STOPPED,
  DONE
}

declare enum LogType {
  ERRORS_ONLY,
  ERRORS_AND_SETTINGS,
  ERRORS_AND_PER_FRAME_INFO
}

declare enum PREFType {
  PREF_Type_MACHINE_SPECIFIC,
  PREF_Type_MACHINE_INDEPENDENT,
  PREF_Type_MACHINE_INDEPENDENT_RENDER,
  PREF_Type_MACHINE_INDEPENDENT_OUTPUT,
  PREF_Type_MACHINE_INDEPENDENT_COMPOSITION,
  PREF_Type_MACHINE_SPECIFIC_TEXT,
  PREF_Type_MACHINE_SPECIFIC_PAINT
}

declare enum ParagraphJustification {
  LEFT_JUSTIFY,
  CENTER_JUSTIFY,
  RIGHT_JUSTIFY,
  FULL_JUSTIFY_LASTLINE_LEFT,
  FULL_JUSTIFY_LASTLINE_RIGHT,
  FULL_JUSTIFY_LASTLINE_CENTER,
  FULL_JUSTIFY_LASTLINE_FULL,
  MULTIPLE_JUSTIFICATIONS
}

declare enum ViewerType {
  VIEWER_COMPOSITION,
  VIEWER_LAYER,
  VIEWER_FOOTAGE
}

declare enum FastPreviewType {
  FP_OFF,
  FP_ADAPTIVE_RESOLUTION,
  FP_DRAFT,
  FP_FAST_DRAFT,
  FP_WIREFRAME
}

declare enum ChannelType {
  CHANNEL_RGB,
  CHANNEL_RED,
  CHANNEL_GREEN,
  CHANNEL_BLUE,
  CHANNEL_ALPHA,
  CHANNEL_RED_COLORIZE,
  CHANNEL_GREEN_COLORIZE,
  CHANNEL_BLUE_COLORIZE,
  CHANNEL_RGB_STRAIGHT,
  CHANNEL_ALPHA_OVERLAY,
  CHANNEL_ALPHA_BOUNDARY,
}

/** CC2015.3- */
declare enum GpuAccelType {
  CUDA,
  METAL,
  OPENCL,
  SOFTWARE,
}

/** CC2017- */
declare enum ToolType {
  Tool_Arrow,
  Tool_Rotate,
  Tool_CameraMaya,
  Tool_CameraOrbit,
  Tool_CameraTrackXY,
  Tool_CameraTrackZ,
  Tool_Paintbrush,
  Tool_CloneStamp,
  Tool_Eraser,
  Tool_Hand,
  Tool_Magnify,
  Tool_PanBehind,
  Tool_Rect,
  Tool_RoundedRect,
  Tool_Oval,
  Tool_Polygon,
  Tool_Star,
  Tool_TextH,
  Tool_TextV,
  Tool_Pen,
  Tool_Feather,
  Tool_PenPlus,
  Tool_PenMinus,
  Tool_PenConvert,
  Tool_Pin,
  Tool_PinStarch,
  Tool_PinDepth,
  Tool_Quickselect,
  Tool_Hairbrush,
}

/** CC2017.2- */
declare enum ResolveType {
  ACCEPT_THEIRS,
  ACCEPT_YOURS,
  ACCEPT_THEIRS_AND_COPY,
}

/** CC 2022(22.3)- */
declare enum SceneEditDetectionMode {
  MARKERS, // Create markers at edit points.
  SPLIT, // Split layer .
  SPLIT_PRECOMP, // Split layer at edit points and pre-compose each one.
  NONE, // Detected edits are not applied to the layer.
}

/** 24.0- */
declare enum CTFontTechnology {
  CT_TYPE1_FONT,
  CT_TRUETYPE_FONT,
  CT_CID_FONT,
  CT_BITMAP_FONT,
  CT_ATC_FONT,
  CT_TYPE3_FONT,
  CT_SVG_FONT,
  CT_ANYTECHNOLOGY,
}

/** 24.0- */
declare enum CTFontType {
  CT_TYPE1_FONTTYPE,
  CT_TRUETYPE_FONTTYPE,
  CT_CID_FONTTYPE,
  CT_ATC_FONTTYPE,
  CT_BITMAP_FONTTYPE,
  CT_OPENTYPE_CFF_FONTTYPE,
  CT_OPENTYPE_CID_FONTTYPE,
  CT_OPENTYPE_TT_FONTTYPE,
  CT_TYPE3_FONTTYPE,
  CT_SVG_FONTTYPE,
}

/** 24.0- */
declare enum CTScript {
  CT_ROMAN_SCRIPT,
  CT_JAPANESE_SCRIPT,
  CT_TRADITIONALCHINESE_SCRIPT,
  CT_KOREAN_SCRIPT,
  CT_ARABIC_SCRIPT,
  CT_HEBREW_SCRIPT,
  CT_GREEK_SCRIPT,
  CT_CYRILLIC_SCRIPT,
  CT_RIGHTLEFT_SCRIPT,
  CT_DEVANAGARI_SCRIPT,
  CT_GURMUKHI_SCRIPT,
  CT_GUJARATI_SCRIPT,
  CT_ORIYA_SCRIPT,
  CT_BENGALI_SCRIPT,
  CT_TAMIL_SCRIPT,
  CT_TELUGU_SCRIPT,
  CT_KANNADA_SCRIPT,
  CT_MALAYALAM_SCRIPT,
  CT_SINHALESE_SCRIPT,
  CT_BURMESE_SCRIPT,
  CT_KHMER_SCRIPT,
  CT_THAI_SCRIPT,
  CT_LAOTIAN_SCRIPT,
  CT_GEORGIAN_SCRIPT,
  CT_ARMENIAN_SCRIPT,
  CT_SIMPLIFIEDCHINESE_SCRIPT,
  CT_TIBETAN_SCRIPT,
  CT_MONGOLIAN_SCRIPT,
  CT_GEEZ_SCRIPT,
  CT_EASTEUROPEANROMAN_SCRIPT,
  CT_VIETNAMESE_SCRIPT,
  CT_EXTENDEDARABIC_SCRIPT,
  CT_KLINGON_SCRIPT,
  CT_EMOJI_SCRIPT,
  CT_ROHINGYA_SCRIPT,
  CT_JAVANESE_SCRIPT,
  CT_SUNDANESE_SCRIPT,
  CT_LONTARA_SCRIPT,
  CT_SYRIAC_SCRIPT,
  CT_TAITHAM_SCRIPT,
  CT_BUGINESE_SCRIPT,
  CT_BALINESE_SCRIPT,
  CT_CHEROKEE_SCRIPT,
  CT_MANDAIC_SCRIPT,
  CT_VAI_SCRIPT,
  CT_THAANA_SCRIPT,
  CT_BRAVANESE_SCRIPT,
  CT_BRAHMI_SCRIPT,
  CT_CARIAN_SCRIPT,
  CT_CYPRIOT_SCRIPT,
  CT_EGYPTIAN_SCRIPT,
  CT_IMPERIALARAMAIC_SCRIPT,
  CT_PAHLAVI_SCRIPT,
  CT_PARTHIAN_SCRIPT,
  CT_KHAROSHTHI_SCRIPT,
  CT_LYCIAN_SCRIPT,
  CT_LYDIAN_SCRIPT,
  CT_PHOENICIAN_SCRIPT,
  CT_PERSIAN_SCRIPT,
  CT_SHAVIAN_SCRIPT,
  CT_SUMAKKCUNEIFORM_SCRIPT,
  CT_UGARITIC_SCRIPT,
  CT_GLAGOLITIC_SCRIPT,
  CT_GOTHIC_SCRIPT,
  CT_OGHAM_SCRIPT,
  CT_OLDITALIC_SCRIPT,
  CT_ORKHON_SCRIPT,
  CT_RUNIC_SCRIPT,
  CT_MEROITICCURSIVE_SCRIPT,
  CT_COPTIC_SCRIPT,
  CT_OLCHIKI_SCRIPT,
  CT_SORASOMPENG_SCRIPT,
  CT_OLDHANGUL_SCRIPT,
  CT_LISU_SCRIPT,
  CT_NKO_SCRIPT,
  CT_ADLAM_SCRIPT,
  CT_BAMUM_SCRIPT,
  CT_BASSAVAH_SCRIPT,
  CT_NEWA_SCRIPT,
  CT_NEWTAILU_SCRIPT,
  CT_SCRIPT,
  CT_OSAGE_SCRIPT,
  CT_UCAS_SCRIPT,
  CT_TIFINAGH_SCRIPT,
  CT_KAYAHLI_SCRIPT,
  CT_LAO_SCRIPT,
  CT_TAILE_SCRIPT,
  CT_TAIVIET_SCRIPT,
  CT_DONTKNOW_SCRIPT,
}

/** 24.0- */
declare enum AutoKernType {
  NO_AUTO_KERN,
  METRIC_KERN,
  OPTICAL_KERN,
}

/** 24.0- */
declare enum BaselineDirection {
  BASELINE_WITH_STREAM,
  BASELINE_VERTICAL_ROTATED,
  BASELINE_VERTICAL_CROSS_STREAM,
}

/** 24.0- */
declare enum ComposerEngine {
  LATIN_CJK_ENGINE,
  UNIVERSAL_TYPE_ENGINE,
}

/** 24.0- */
declare enum DigitSet {
  DEFAULT_DIGITS,
  ARABIC_DIGITS,
  HINDI_DIGITS,
  FARSI_DIGITS,
  ARABIC_DIGITS_RTL,
}

/** 24.0- */
declare enum ParagraphDirection {
  DIRECTION_LEFT_TO_RIGHT,
  DIRECTION_RIGHT_TO_LEFT,
}

/** 24.0- */
declare enum FontBaselineOption {
  FONT_NORMAL_BASELINE,
  FONT_FAUXED_SUPERSCRIPT,
  FONT_FAUXED_SUBSCRIPT,
}

/** 24.0- */
declare enum FontCapsOption {
  FONT_NORMAL_CAPS,
  FONT_SMALL_CAPS,
  FONT_ALL_CAPS,
  FONT_ALL_SMALL_CAPS,
}

/** 24.0- */
declare enum LeadingType {
  ROMAN_LEADING_TYPE,
  JAPANESE_LEADING_TYPE,
}

/** 24.0- */
declare enum LineJoinType {
  LINE_JOIN_MITER,
  LINE_JOIN_ROUND,
  LINE_JOIN_BEVEL,
}

/** 24.2- */
declare enum LineOrientation {
  HORIZONTAL,
  VERTICAL_RIGHT_TO_LEFT,
  VERTICAL_LEFT_TO_RIGHT,
}

/** 24.3- */
declare enum BoxAutoFitPolicy {
  NONE,
  HEIGHT_CURSOR,
  HEIGHT_PRECISE_BOUNDS,
  HEIGHT_BASELINE,
}

/** 24.3- */
declare enum BoxFirstBaselineAlignment {
  ASCENT,
  CAP_HEIGHT,
  EM_BOX,
  LEADING,
  LEGACY_METRIC,
  MINIMUM_VALUE_ASIAN,
  MINIMUM_VALUE_ROMAN,
  TYPO_ASCENT,
  X_HEIGHT,
}

/** 24.3- */
declare enum BoxVerticalAlignment {
  TOP,
  CENTER,
  BOTTOM,
  JUSTIFY,
}