
/**
 * @enum {string}
 * @description The languages supported by the application.
 */
export enum AppLanguage {
  ENGLISH = 'English',
  RUSSIAN = 'Russian'
}

/**
 * @interface Citation
 * @description Represents a biblical citation.
 * @property {string} book - The book of the Bible.
 * @property {number} chapter - The chapter number.
 * @property {number} verse_start - The starting verse number.
 * @property {number} [verse_end] - The ending verse number.
 * @property {string} text - The text of the citation.
 * @property {string} relevance - The relevance of the citation to the topic.
 */
export interface Citation {
  book: string;
  chapter: number;
  verse_start: number;
  verse_end?: number;
  text: string;
  relevance: string;
}

/**
 * @interface Theme
 * @description Represents a theological theme.
 * @property {string} name - The name of the theme.
 * @property {number} score - The relevance score of the theme (0-100).
 * @property {string} description - A description of the theme.
 */
export interface Theme {
  name: string;
  score: number; // 0-100
  description: string;
}

/**
 * @interface Relationship
 * @description Represents a relationship between two entities.
 * @property {string} source - The source entity.
 * @property {string} target - The target entity.
 * @property {string} type - The type of relationship.
 * @property {number} strength - The strength of the relationship.
 * @property {string} [description] - The context for the relationship.
 */
export interface Relationship {
  source: string;
  target: string;
  type: string;
  strength: number;
  description?: string; // Context for the relationship
}

/**
 * @interface CrossReference
 * @description Represents a cross-reference between two biblical passages.
 * @property {string} primary_verse - The primary verse.
 * @property {string} primary_text - The text of the primary verse.
 * @property {string} related_verse - The related verse.
 * @property {string} related_text - The text of the related verse.
 * @property {string} connection_type - The type of connection (e.g., "Prophecy Fulfillment", "Thematic Echo", "Direct Quote").
 * @property {string} description - A description of the connection.
 */
export interface CrossReference {
  primary_verse: string;
  primary_text: string; // Added for DNA Diff
  related_verse: string;
  related_text: string; // Added for DNA Diff
  connection_type: string; // e.g., "Prophecy Fulfillment", "Thematic Echo", "Direct Quote"
  description: string;
}

/**
 * @interface TimelineEvent
 * @description Represents an event on a timeline.
 * @property {string} year - The year of the event.
 * @property {string} event - The name of the event.
 * @property {string} description - A description of the event.
 */
export interface TimelineEvent {
  year: string;
  event: string;
  description: string;
}

/**
 * @interface BiblicalLocation
 * @description Represents a biblical location.
 * @property {string} name - The name of the location.
 * @property {number} latitude - The latitude of the location.
 * @property {number} longitude - The longitude of the location.
 * @property {string} description - A description of the location.
 * @property {string} significance - The significance of the location.
 * @property {string[]} associated_figures - The figures associated with the location.
 * @property {string[]} associated_themes - The themes associated with the location.
 */
export interface BiblicalLocation {
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  significance: string;
  associated_figures: string[];
  associated_themes: string[];
}

/**
 * @interface KeyFigure
 * @description Represents a key figure.
 * @property {string} name - The name of the figure.
 * @property {string} role - The role of the figure.
 * @property {string} description - A description of the figure.
 */
export interface KeyFigure {
  name: string;
  role: string;
  description: string;
}

// --- Bible as Code Types ---

/**
 * @interface LogicVariable
 * @description Represents a variable in the "Bible as Code" analysis.
 * @property {string} name - The name of the variable.
 * @property {'constant' | 'mutable' | 'global'} type - The type of the variable.
 * @property {string} value - The value of the variable (e.g., "Unconditional", "Hardened", "Grace").
 * @property {string} description - A description of the variable.
 */
export interface LogicVariable {
  name: string;
  type: 'constant' | 'mutable' | 'global';
  value: string; // e.g., "Unconditional", "Hardened", "Grace"
  description: string;
}

/**
 * @interface LogicStep
 * @description Represents a step in the logic flow of the "Bible as Code" analysis.
 * @property {'condition' | 'loop' | 'action' | 'assignment'} type - The type of the logic step.
 * @property {string} code - The pseudo-code representation of the logic step.
 * @property {string} explanation - The theological explanation of the logic step.
 * @property {number} indent_level - The indentation level for visual hierarchy.
 */
export interface LogicStep {
  type: 'condition' | 'loop' | 'action' | 'assignment';
  code: string; // e.g., "if (repentance) { forgiveness = true }"
  explanation: string;
  indent_level: number; // For visual hierarchy 0, 1, 2...
}

/**
 * @interface AlgorithmicAnalysis
 * @description Represents the "Bible as Code" analysis.
 * @property {LogicVariable[]} variables - The variables in the analysis.
 * @property {LogicStep[]} logic_flow - The logic flow of the analysis.
 */
export interface AlgorithmicAnalysis {
  variables: LogicVariable[];
  logic_flow: LogicStep[];
}

// --- Bio-Theology Types (DNA/RNA) ---

/**
 * @interface BioBase
 * @description Represents a single nucleotide in the bio-theology analysis.
 * @property {'A' | 'C' | 'G' | 'T' | 'U'} nucleotide - The nucleotide (A=Authority/Law, C=Compassion/Grace, G=Glory/Spirit, T=Truth/Word, U=Urgency/Action (RNA)).
 * @property {string} concept - The concept represented by the nucleotide (e.g., "Command", "Mercy").
 * @property {string} snippet - The specific word or phrase mapped to the nucleotide.
 */
export interface BioBase {
  nucleotide: 'A' | 'C' | 'G' | 'T' | 'U'; // A=Authority/Law, C=Compassion/Grace, G=Glory/Spirit, T=Truth/Word, U=Urgency/Action (RNA)
  concept: string; // e.g., "Command", "Mercy"
  snippet: string; // The specific word/phrase mapped
}

/**
 * @interface BioCodon
 * @description Represents a codon in the bio-theology analysis.
 * @property {string} sequence - The codon sequence (e.g. "ACG").
 * @property {string} amino_acid - The spiritual "protein" produced by the codon (e.g., "Redemption").
 * @property {string} description - A description of the codon.
 */
export interface BioCodon {
  sequence: string; // e.g. "ACG"
  amino_acid: string; // The spiritual "protein" e.g., "Redemption"
  description: string;
}

/**
 * @interface BioTheology
 * @description Represents the bio-theology analysis.
 * @property {BioBase[]} sequence_data - The sequence of nucleotides.
 * @property {BioCodon[]} codons - The codons in the sequence.
 * @property {string} summary - An explanation of the "genetic" makeup of the passage.
 */
export interface BioTheology {
  sequence_data: BioBase[];
  codons: BioCodon[];
  summary: string; // Explanation of the "genetic" makeup of this passage
}

// --- Etymological Spectrometry Types (Source Code) ---

/**
 * @interface EtymologyRoot
 * @description Represents a root word in the etymological analysis.
 * @property {string} original_word - The original word (e.g. "Hesed" or "Agape").
 * @property {'Hebrew' | 'Greek' | 'Aramaic'} language - The language of the original word.
 * @property {string} transliteration - The transliteration of the original word.
 * @property {string} meaning - The meaning of the original word.
 * @property {number} usage_count - The approximate number of occurrences in the Bible.
 * @property {string} usage_context - The context in which the word is used.
 */
export interface EtymologyRoot {
  original_word: string; // e.g. "Hesed" or "Agape"
  language: 'Hebrew' | 'Greek' | 'Aramaic';
  transliteration: string;
  meaning: string;
  usage_count: number; // Approx occurrences in bible
  usage_context: string; // Where else it is used
}

/**
 * @interface EtymologyAnalysis
 * @description Represents the etymological analysis.
 * @property {string} target_word - The concept being analyzed (e.g. "Love").
 * @property {EtymologyRoot[]} roots - The root words of the concept.
 * @property {string} synthesis - How the diverse roots combine to form the full biblical meaning.
 */
export interface EtymologyAnalysis {
  target_word: string; // The concept being analyzed (e.g. "Love")
  roots: EtymologyRoot[];
  synthesis: string; // How these diverse roots combine to form the full biblical meaning
}

// --- Chrono-Spatial 4D Types ---

/**
 * @interface MapFeature
 * @description Represents a feature on the chrono-spatial map.
 * @property {string} name - The name of the feature.
 * @property {'structure' | 'natural' | 'event'} type - The type of the feature.
 * @property {number} latitude - The latitude of the feature.
 * @property {number} longitude - The longitude of the feature.
 * @property {string} description - A description of the feature.
 */
export interface MapFeature {
  name: string;
  type: 'structure' | 'natural' | 'event';
  latitude: number;
  longitude: number;
  description: string;
}

/**
 * @interface HistoricalEra
 * @description Represents a historical era in the chrono-spatial analysis.
 * @property {string} era_name - The name of the era (e.g. "Bronze Age (Melchizedek)").
 * @property {string} year_range - The year range of the era (e.g. "c. 2000-1500 BC").
 * @property {string} description - The context of the city/location in this era.
 * @property {{ lat: number; lng: number }} city_center - The center of the city in this era.
 * @property {number} city_radius - The radius of the city in meters.
 * @property {MapFeature[]} features - The key structures visible in this era.
 */
export interface HistoricalEra {
  era_name: string; // e.g. "Bronze Age (Melchizedek)"
  year_range: string; // e.g. "c. 2000-1500 BC"
  description: string; // Context of the city/location in this era
  city_center: { lat: number; lng: number }; 
  city_radius: number; // in meters, for drawing the approximate bounds/walls
  features: MapFeature[]; // Key structures visible in this era
}

/**
 * @interface ChronoSpatialAnalysis
 * @description Represents the chrono-spatial analysis.
 * @property {string} location_name - The main location being analyzed (e.g. Jerusalem, Babylon).
 * @property {HistoricalEra[]} eras - The historical eras of the location.
 */
export interface ChronoSpatialAnalysis {
  location_name: string; // The main location being analyzed (e.g. Jerusalem, Babylon)
  eras: HistoricalEra[];
}

// --- The Council of Three (Sanhedrin Protocol) ---

/**
 * @typedef {'Archaeologist' | 'Theologian' | 'Mystic'} CouncilRole
 * @description The roles in the Council of Three.
 */
export type CouncilRole = 'Archaeologist' | 'Theologian' | 'Mystic';

/**
 * @interface DebateTurn
 * @description Represents a turn in the debate.
 * @property {CouncilRole} speaker - The speaker of the turn.
 * @property {string} content - The content of the turn.
 * @property {'analytical' | 'skeptical' | 'reverent' | 'passionate' | 'firm'} tone - The tone of the turn.
 */
export interface DebateTurn {
  speaker: CouncilRole;
  content: string; // The argument/statement
  tone: 'analytical' | 'skeptical' | 'reverent' | 'passionate' | 'firm';
}

/**
 * @interface CouncilConsensus
 * @description Represents the consensus reached by the council.
 * @property {string} agreement_statement - The synthesis agreed upon by all.
 * @property {string[]} pending_questions - The mysteries left unresolved.
 */
export interface CouncilConsensus {
  agreement_statement: string; // The synthesis agreed upon by all
  pending_questions: string[]; // Mysteries left unresolved
}

/**
 * @interface CouncilSession
 * @description Represents a council session.
 * @property {string} topic - The topic of the session.
 * @property {DebateTurn[]} debate_transcript - The transcript of the debate.
 * @property {CouncilConsensus} verdict - The verdict of the council.
 */
export interface CouncilSession {
  topic: string;
  debate_transcript: DebateTurn[];
  verdict: CouncilConsensus;
}

// --- Multi-Agent Peer Review Types ---

/**
 * @interface PeerReview
 * @description Represents a peer review of an analysis.
 * @property {string} reviewer_name - The name of the reviewer (e.g., "Mistral Large").
 * @property {number} agreement_score - The agreement score (0-100).
 * @property {string} truth_fidelity_analysis - A general critique of the analysis.
 * @property {string[]} consensus_points - Points where both AIs agree strongly.
 * @property {string[]} divergent_points - Points where Mistral disagrees or offers nuance.
 * @property {Citation[]} missed_citations - Citations Mistral thinks Gemini missed.
 * @property {string} cross_examination - A synthesis of the comparison.
 */
export interface PeerReview {
  reviewer_name: string; // e.g., "Mistral Large"
  agreement_score: number; // 0-100
  truth_fidelity_analysis: string; // General critique
  consensus_points: string[]; // Points where both AIs agree strongly
  divergent_points: string[]; // Points where Mistral disagrees or offers nuance
  missed_citations: Citation[]; // Citations Mistral thinks Gemini missed
  cross_examination: string; // A synthesis of the comparison
}

// --- Cohere Apologetics Types ---

/**
 * @interface ApologeticPoint
 * @description Represents a point in an apologetic argument.
 * @property {string} claim - The claim being made.
 * @property {string} rebuttal - The rebuttal to the claim.
 * @property {string} scripture_defense - The scriptural defense for the rebuttal.
 */
export interface ApologeticPoint {
  claim: string;
  rebuttal: string;
  scripture_defense: string;
}

/**
 * @interface ApologeticsData
 * @description Represents the data for an apologetic argument.
 * @property {string} cultural_context - How the topic relates to the modern day (Zeitgeist).
 * @property {ApologeticPoint[]} hard_questions - The top 2-3 skeptic objections.
 * @property {string} ethical_imperative - The "So What" / Actionable conclusion.
 */
export interface ApologeticsData {
  cultural_context: string; // How this relates to modern day (Zeitgeist)
  hard_questions: ApologeticPoint[]; // Top 2-3 skeptic objections
  ethical_imperative: string; // The "So What" / Actionable conclusion
}

/**
 * @interface AnalysisData
 * @description Represents the complete analysis data for a topic.
 * @property {string} summary - The summary of the analysis.
 * @property {string} theological_insight - The theological insight of the analysis.
 * @property {Citation[]} citations - The citations in the analysis.
 * @property {Theme[]} themes - The themes in the analysis.
 * @property {Relationship[]} relationships - The relationships in the analysis.
 * @property {CrossReference[]} cross_references - The cross-references in the analysis.
 * @property {string} historical_context - The historical context of the analysis.
 * @property {TimelineEvent[]} timeline - The timeline of events in the analysis.
 * @property {BiblicalLocation[]} locations - The locations in the analysis.
 * @property {KeyFigure[]} key_figures - The key figures in the analysis.
 * @property {AlgorithmicAnalysis} algorithmic_analysis - The algorithmic analysis of the topic.
 * @property {BioTheology} [bio_theology] - The bio-theology analysis of the topic.
 * @property {EtymologyAnalysis} [etymology] - The etymology analysis of the topic.
 * @property {ChronoSpatialAnalysis} [chrono_spatial] - The chrono-spatial analysis of the topic.
 * @property {PeerReview} [peer_review] - The peer review of the analysis.
 * @property {CouncilSession} [council_session] - The council session of the analysis.
 * @property {ApologeticsData} [apologetics] - The apologetics data of the analysis.
 */
export interface AnalysisData {
  summary: string;
  theological_insight: string;
  citations: Citation[];
  themes: Theme[];
  relationships: Relationship[];
  cross_references: CrossReference[];
  historical_context: string;
  timeline: TimelineEvent[];
  locations: BiblicalLocation[];
  key_figures: KeyFigure[];
  algorithmic_analysis: AlgorithmicAnalysis;
  bio_theology?: BioTheology; 
  etymology?: EtymologyAnalysis; 
  chrono_spatial?: ChronoSpatialAnalysis; 
  peer_review?: PeerReview; 
  council_session?: CouncilSession; 
  apologetics?: ApologeticsData; // New field for Cohere
}

/**
 * @interface ChatMessage
 * @description Represents a message in the chat.
 * @property {string} id - The unique ID of the message.
 * @property {'user' | 'model'} role - The role of the message sender.
 * @property {string} text - The text of the message.
 * @property {Date} timestamp - The timestamp of the message.
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

/**
 * @typedef {'1K' | '2K' | '4K'} ImageSize
 * @description The possible sizes for generated images.
 */
export type ImageSize = '1K' | '2K' | '4K';

/**
 * @interface ImageConfig
 * @description Represents the configuration for a generated image.
 * @property {ImageSize} size - The size of the image.
 * @property {string} prompt - The prompt for the image.
 */
export interface ImageConfig {
  size: ImageSize;
  prompt: string;
}