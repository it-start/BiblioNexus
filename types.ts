
export enum AppLanguage {
  ENGLISH = 'English',
  RUSSIAN = 'Russian'
}

export interface Citation {
  book: string;
  chapter: number;
  verse_start: number;
  verse_end?: number;
  text: string;
  relevance: string;
}

export interface Theme {
  name: string;
  score: number; // 0-100
  description: string;
}

export interface Relationship {
  source: string;
  target: string;
  type: string;
  strength: number;
  description?: string; // Context for the relationship
}

export interface CrossReference {
  primary_verse: string;
  primary_text: string; // Added for DNA Diff
  related_verse: string;
  related_text: string; // Added for DNA Diff
  connection_type: string; // e.g., "Prophecy Fulfillment", "Thematic Echo", "Direct Quote"
  description: string;
}

export interface TimelineEvent {
  year: string;
  event: string;
  description: string;
}

export interface BiblicalLocation {
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  significance: string;
  associated_figures: string[];
  associated_themes: string[];
}

export interface KeyFigure {
  name: string;
  role: string;
  description: string;
}

// --- Bible as Code Types ---

export interface LogicVariable {
  name: string;
  type: 'constant' | 'mutable' | 'global';
  value: string; // e.g., "Unconditional", "Hardened", "Grace"
  description: string;
}

export interface LogicStep {
  type: 'condition' | 'loop' | 'action' | 'assignment';
  code: string; // e.g., "if (repentance) { forgiveness = true }"
  explanation: string;
  indent_level: number; // For visual hierarchy 0, 1, 2...
}

export interface AlgorithmicAnalysis {
  variables: LogicVariable[];
  logic_flow: LogicStep[];
}

// --- Bio-Theology Types (DNA/RNA) ---

export interface BioBase {
  nucleotide: 'A' | 'C' | 'G' | 'T' | 'U'; // A=Authority/Law, C=Compassion/Grace, G=Glory/Spirit, T=Truth/Word, U=Urgency/Action (RNA)
  concept: string; // e.g., "Command", "Mercy"
  snippet: string; // The specific word/phrase mapped
}

export interface BioCodon {
  sequence: string; // e.g. "ACG"
  amino_acid: string; // The spiritual "protein" e.g., "Redemption"
  description: string;
}

export interface BioTheology {
  sequence_data: BioBase[];
  codons: BioCodon[];
  summary: string; // Explanation of the "genetic" makeup of this passage
}

// --- Etymological Spectrometry Types (Source Code) ---

export interface EtymologyRoot {
  original_word: string; // e.g. "Hesed" or "Agape"
  language: 'Hebrew' | 'Greek' | 'Aramaic';
  transliteration: string;
  meaning: string;
  usage_count: number; // Approx occurrences in bible
  usage_context: string; // Where else it is used
}

export interface EtymologyAnalysis {
  target_word: string; // The concept being analyzed (e.g. "Love")
  roots: EtymologyRoot[];
  synthesis: string; // How these diverse roots combine to form the full biblical meaning
}

// --- Chrono-Spatial 4D Types ---

export interface MapFeature {
  name: string;
  type: 'structure' | 'natural' | 'event';
  latitude: number;
  longitude: number;
  description: string;
}

export interface HistoricalEra {
  era_name: string; // e.g. "Bronze Age (Melchizedek)"
  year_range: string; // e.g. "c. 2000-1500 BC"
  description: string; // Context of the city/location in this era
  city_center: { lat: number; lng: number }; 
  city_radius: number; // in meters, for drawing the approximate bounds/walls
  features: MapFeature[]; // Key structures visible in this era
}

export interface ChronoSpatialAnalysis {
  location_name: string; // The main location being analyzed (e.g. Jerusalem)
  eras: HistoricalEra[];
}

// --- The Council of Three (Sanhedrin Protocol) ---

export type CouncilRole = 'Archaeologist' | 'Theologian' | 'Mystic';

export interface DebateTurn {
  speaker: CouncilRole;
  content: string; // The argument/statement
  tone: 'analytical' | 'skeptical' | 'reverent' | 'passionate' | 'firm';
}

export interface CouncilConsensus {
  agreement_statement: string; // The synthesis agreed upon by all
  pending_questions: string[]; // Mysteries left unresolved
}

export interface CouncilSession {
  topic: string;
  debate_transcript: DebateTurn[];
  verdict: CouncilConsensus;
}

// --- Multi-Agent Peer Review Types ---

export interface PeerReview {
  reviewer_name: string; // e.g., "Mistral Large"
  agreement_score: number; // 0-100
  truth_fidelity_analysis: string; // General critique
  consensus_points: string[]; // Points where both AIs agree strongly
  divergent_points: string[]; // Points where Mistral disagrees or offers nuance
  missed_citations: Citation[]; // Citations Mistral thinks Gemini missed
  cross_examination: string; // A synthesis of the comparison
}

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
  bio_theology?: BioTheology; // New field for DNA Analysis
  etymology?: EtymologyAnalysis; // New field for Source Code Analysis
  chrono_spatial?: ChronoSpatialAnalysis; // New field for 4D Maps
  peer_review?: PeerReview; 
  council_session?: CouncilSession; // New field for The Council
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type ImageSize = '1K' | '2K' | '4K';

export interface ImageConfig {
  size: ImageSize;
  prompt: string;
}
