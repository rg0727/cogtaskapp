import numpy as np
from numpy.linalg import norm
from openai import OpenAI

# Initialize OpenAI Client (Replace with a Secure API Key)
client = OpenAI(api_key="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")

def get_embedding(text):
    """Generate an embedding using OpenAI."""
    response = client.embeddings.create(
        model="text-embedding-ada-002",
        input=text
    )
    return np.array(response.data[0].embedding)

# Generate a proper reference embedding instead of a random one
test_embedding = get_embedding("This flower is a rose")

def cosine_similarity(vec1, vec2):
    """Calculate cosine similarity between two embeddings."""
    return np.dot(vec1, vec2) / (norm(vec1) * norm(vec2))

def process_user_input(user_input):
    """Compare user input against test embedding and generate AI response."""
    user_embedding = get_embedding(user_input)
    similarity_score = cosine_similarity(user_embedding, test_embedding)
    quality_score = round(similarity_score * 5, 1)  # Scale from 0 to 5

    prompt = f"""
    The user provided the following input: "{user_input}".
    
    The expected reference phrase is: "This flower is a rose".
    Mark them as correct if they mention the correct flower name, even if the full sentence isn't exact.
    The similarity score between the user input and the reference is {similarity_score:.2f}.
    
    User is someone with cognitive disabilities, so:
    - Provide a response that is **easy to understand**.
    - Guide them **towards the correct answer** without being too strict.
    - If the classification is wrong but the category is correct, help refine their answer.
    - Do **not** mention the correct flower name directly. Instead, prompt them to give the correct answer.
    - If the user doesn't get it correctly after 4 tries, give them multiple choices.

    **Your task:**
    - If the score is high (≥0.8), confirm the input as correct and end the conversation.
    - If the score is medium (0.5-0.8), suggest a refined version.
    - If the score is low (<0.5), ask the user for clarification.

    Provide an improved version of the input if necessary.
    """

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )

    ai_response = completion.choices[0].message.content

    return {
        "similarity_score": similarity_score,
        "quality_score": quality_score,
        "ai_response": ai_response
    }

def chat():
    """Interactive chat loop with AI feedback."""
    print("\n🌸 Welcome to the Flower Identification Chat! 🌸")
    print("Type 'exit' to quit.\n")

    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            print("\n👋 Goodbye! Have a great day!")
            break
        
        result = process_user_input(user_input)

        print(f"\n🔹 Similarity Score: {result['similarity_score']:.2f}")
        print(f"🔸 Quality Score: {result['quality_score']}/5")
        print("\n💬 AI Response:\n" + result['ai_response'])
        print("\n" + "="*50 + "\n")  # Separator for readability

if __name__ == '__main__':
    chat()
