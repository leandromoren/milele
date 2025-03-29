import spacy

# Cargar modelo en español
nlp = spacy.load("es_core_news_md")

def procesar_consulta(consulta: str):
  doc = nlp(consulta.lower())

  # Filtrar solo sustantivos y adjetivos para mejorar la búsqueda
  palabras_clave = [token.text for token in doc if token.pos_ in ["NOUN", "ADJ"]]
    
  return " ".join(palabras_clave)