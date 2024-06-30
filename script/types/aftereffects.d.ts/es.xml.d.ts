// https://github.com/docsforadobe/Types-for-Adobe

declare function setDefaultXMLNamespace(namespace: Namespace): void;

declare function isXMLName(name: string): boolean;

interface QNameConstructor {
  readonly prototype: QName

  /**
   * Creates a QName object.
   * @param uri The URI, specified as a Namespace object, an existing QName object, or string. If this is a Namespace object, the URI is set to the namespace URI, and there is no local name. If this is a QName object, the URI and localName is set to those of that object. If this is a string, the URI is set to that string.
   * @param name The local name. Used only if URI is given as a string.
   */
  new (uri: any, name?: string): QName
  (uri: any, name?: string): QName
}
declare const QName: QNameConstructor

/**
 * A qualified XML name, containing the URI and the local name.
 */
interface QName {
  /**
   * The local name part of the qualified name.
   */
  readonly localName: string

  /**
   * The URI part of the qualified name.
   */
  readonly uri: string
}

interface NamespaceConstructor {
  readonly prototype: Namespace

  /**
   * Creates a Namespace object.
   * @param prefix The URIprefix, specified as an existing Namespace object, QName object, or string. If this is a Namespace or a QName object, the URI and prefix are set to that of the object. If this is a string, the prefix is set to that string, and the URI must be specified.
   * @param uri The URI if the prefix is specified as a string.
   */
  new (prefix: any, uri?: string): Namespace
  (prefix: any, uri?: string): Namespace
}
declare const Namespace: NamespaceConstructor

/**
 * A XML namespace object.
 */
interface Namespace {
  /**
   * The named prefix.
   */
  readonly prefix: string

  /**
   * The URI.
   */
  readonly uri: string
}

interface XMLConstructor {
  readonly prototype: XML

  /**
   * Parses an XML string. Throws an error if the XML is incorrect.
   * @param text The text to parse.
   */
  new (text?: string): XML
  (text: string): XML

  /**
   * Controls whether XML comments should be parsed (false) or ignored (true).
   */
  ignoreComments: boolean

  /**
   * Controls whether XML preprocessing instructions should be parsed (false) or ignored (true).
   */
  ignoreProcessingInstructions: boolean

  /**
   * Controls whether whitespace should be parsed (false) or ignored (true).
   */
  ignoreWhitespace: boolean

  /**
   * The number of spaces used to indent pretty-printed XML.
   */
  prettyIndent: number

  /**
   * When true, XML is pretty-printed when converting to a string.
   */
  prettyPrinting: boolean

  /**
   * Returns an object containing the default parsing and print settings for XML.
   */
  defaultSettings(): object

  /**
   * Sets the parsing and print setting for XML using an object returned by the settings() method.
   * @param obj The object containing the settings to set.
   */
  setSettings(obj: object): void

  /**
   * Returns an object containing the current parsing and print settings for XML.
   */
  settings(): object
}
declare const XML: XMLConstructor

/**
 * Wraps XML into an object.
 */
interface XML {
  [index: number]: XML;
  /**
   * Adds a namespace declaration to the node. Returns the XML object itself.
   * @param namespace The namespace to add.
   */
  addNamespace(namespace: Namespace): XML

  /**
   * Appends the given XML to this XML as a child. Returns the XML object itself.
   * If the argument is not XML, creates a new XML element containing the argument as text. The element name of that new XML is the same as the last element in the original XML.
   * @param child The child XML to add.
   */
  appendChild(child: XML): XML

  /**
   * Returns a list containing all attribute elements matching the given name.
   * @param name The attribute name to look for.
   */
  attribute(name: string): XML

  /**
   * Returns a list containing all attribute elements.
   */
  attributes(): XML

  /**
   * Returns a list containing all children of this XML matching the given element name.
   * If the argument is a number, uses the number as index into the array of children.
   * @param name The name or the index of the child element.
   */
  child(name: string): XML

  /**
   * Returns a number representing the ordinal position of this XML object within the context of its parent.
   */
  childIndex(): number

  /**
   * Returns an XML object containing all the properties of this XML object in order.
   */
  children(): XML

  /**
   * Returns an XML object containing the properties of this XML object that represent XML comments.
   */
  comments(): XML

  /**
   * Checks if this XML object contains the given XML object.
   * @param xml The XML to search for.
   */
  contains(xml: XML): boolean

  /**
   * Creates a copy of this XML object.
   */
  copy(): XML

  /**
   * Returns all the XML-valued descendants of this XML object with the given name.
   * If the name parameter is omitted, returns all descendants of this XML object.
   * @param name The name of the descendant to find.
   */
  descendants(name?: string): XML

  /**
   * Returns a list of XML children that are elements with a given name, or all children that are XML elements.
   * @param name The element name. If not supplied, gets all children that are XML elements.
   */
  elements(name?: string): XML

  /**
   * Reports whether this XML object contains complex content.
   * An XML object is considered to contain complex content if it represents an XML element that has child elements. XML objects representing attributes, comments, processing instructions and text nodes do not have complex content. The existence of attributes, comments, processing instructions and text nodes within an XML object is not significant in determining if it has complex content.
   */
  hasComplexContent(): boolean

  /**
   * Reports whether this XML object contains simple content.
   * An XML object is considered to contain simple content if it represents a text node, represents an attribute node or if it represents an XML element that has no child elements. XML objects representing comments and processing instructions do not have simple content. The existence of attributes, comments, processing instructions and text nodes within an XML object is not significant in determining if it has simple content.
   */
  hasSimpleContent(): boolean

  /**
   * Returns an array of Namespace objects mirroring the current list of valid namespaces at this element.
   * The last element of thereturned array is the default namespace.
   */
  inScopeNamespaces(): Namespace[]

  /**
   * Inserts the given child2 after the given child1 in this XML object and returns this XML object.
   * If child1 is null, the method inserts child2 before all children of this XML object (that is, after none of them). If child1 does not exist in this XML object, the method returns without modifying this XML object.
   * @param child1 The child to insert the other child after. If null, the method inserts child2 before all children of this XML object.
   * @param child2 The XML to insert.
   */
  insertChildAfter(child1: XML, child2: XML): void

  /**
   * Inserts the given child2 before the given child1 in this XML object and returns this XML object.
   * If child1 is null, the method inserts child2 after all children of this XML object (that is, before none of them). If child1 does not exist in this XML object, the method returns without modifying this XML object.
   * @param child1 The child to search for. If null, the method inserts child2 after all children of this XML object.
   * @param child2 The XML to insert.
   */
  insertChildBefore(child1: XML, child2: XML): void

  /**
   * Returns the number of elements contained in an XML list. If this XML object is not a list, returns 1.
   */
  length(): number

  /**
   * Returns the local name of this XML object.
   * This value corresponds to the element name unless the name has a namespace prefix. For example, if the element has the name "ns:tag", the return value is "tag".
   */
  localName(): string

  /**
   * Returns a QName object containing the URI and the local name of the element.
   */
  name(): QName

  /**
   * Returns a Namespace object containing the namespace URI of the current element.
   */
  namespace(): Namespace

  /**
   * Returns an array containing all namespace declarations of this XML object.
   */
  namespaceDeclarations(): Namespace[]

  /**
   * Returns the type of this XML object as one of the strings "element", "attribute", "comment", "processing-instruction", or "text".
   */
  nodeKind(): string

  /**
   * Puts all text nodes in this and all descendant XML objects into a normal form by merging adjacent text nodes and eliminating empty text nodes. Returns this XML object.
   */
  normalize(): XML

  /**
   * Returns the parent object of this XML object.
   * The root object, as returned by the XML constructor, does not have a parent and returns null. Note that the E4X standard does not define what happens if this XML object is a list containing elements with multiple parents.
   */
  parent(): XML

  /**
   * Inserts a given child into this object before its existing XML properties, and returns this XML object.
   * @param child The XML to insert.
   */
  prependChild(child: XML): XML

  /**
   * Returns a list of preprocessing instructions.
   * Collects processing-instructions with the given name, if supplied. Otherwise, returns an XML list containing all the children of this XML object that are processing-instructions regardless of their name.
   * @param name The name of the preprocessing instruction to return.
   */
  processingInstructions(name?: string): XML

  /**
   * Removes the given namespace from this XML, and returns this XML.
   * @param namespace The namespace to remove.
   */
  removeNamespace(namespace: Namespace): XML

  /**
   * Replaces the value of specified XML properties of this XML object returns this XML object.
   * This method acts like the assignment operator.
   * @param name The property name. Can be a numeric property name, a name for a set of XML elements, or the properties wildcard “*”. If this XML object contains no properties that match the name, the method returns without modifying this XML object.
   * @param value The XML with which to replace the value of the matching property. Can be an XML object, XML list or any value that can be converted to a String with toString().
   */
  replace(name: string, value: XML): XML

  /**
   * Replaces all of the XML-valued properties in this object with a new value, and returns this XML object.
   * @param value The new value, which can be a single XML object or an XML list.
   */
  setChildren(value: XML): XML

  /**
   * Replaces the local name of this XML objectwith a string constructed from the given name
   * The local name is any part behind a colon character. If there is no colon, it is the entire name.
   * @param name The name to set.
   */
  setLocalName(name: string): void

  /**
   * Replaces the name of this XML object with the given QName object.
   * @param name The fully qualified name.
   */
  setName(name: QName): void

  /**
   * Sets the namespace for this XML element.
   * If the namespace has not been declared in the tree above this element, adds a namespace declaration.
   * @param namespace The namespace to set.
   */
  setNamespace(namespace: Namespace): void

  /**
   * Returns an XML list containing all XML properties of this XML object that represent XML text nodes.
   */
  text(): XML

  /**
   * Returns the string representation of this object.
   * For text and attribute nodes, this is the textual value of the node; for other elements, this is the result of calling the toXMLString() method. If this XML object is a list, concatenates the result of calling toString() on each element.
   */
  toString(): string

  /**
   * Returns an XML-encoded string representation of this XML object.
   * Always includes the start tag, attributes and end tag of the XML object regardless of its content. It is provided for cases when the default XML to string conversion rules are not desired. Interprets the global settings XML.prettyPrint and XML.prettyIndent.
   */
  toXMLString(): string

  /**
   * Evaluates the given XPath expression in accordance with the W3C XPath recommendation, using this XML object as the context node.
   * @param expr The XPath expression to use.
   */
  xpath(expr: string): XML
}

/**
 * An XML list object.
 * In this implementation, an XMLList object is synonymous to the XML object. The constructor accepts an XML list, but everything else works like theXML object.
 */
interface XMLList {}
declare const XMLList: XMLList
type UnitNameAbbrev = 'in' | 'ft' | 'yd'  | 'mi'  | 'mm' | 'cm' | 'm' | 'km' |
                      'pt' | 'pc' | 'tpt' | 'tpc' | 'ci' | 'px' | '%'

type UnitName = UnitNameAbbrev |
                'inch' | 'inches' |
                'foot' | 'feet' |
                'yard' | 'yards' |
                'mile' | 'miles' |
                'millimeter' | 'millimeters' |
                'centimeter' | 'centimeters' |
                'meter' | 'meters' |
                'kilometer' | 'kilometers' |
                'point' | 'points' |
                'pica' | 'picas' |
                'traditional point' | 'traditional points' |
                'traditional pica' | 'traditional picas' |
                'cicero' | 'ciceros' |
                'pixel' | 'pixels' |
                'percent' | 'percent'