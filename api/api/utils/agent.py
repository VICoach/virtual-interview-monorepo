from api.config.clients import get_groq_client
from api.config.settings import get_settings

groq_client = get_groq_client()
settings = get_settings()

class Agent:
    def __init__(self):
        self.client = groq_client
        self.problem = self.addProblem()
        self.system_prompt = self.getSystemPrompt()
        self.messages = [{"role": "system", "content": self.system_prompt}]

    def addProblem(self):
        problem = """
            - **Problem Statement:**
                "You are given an `n x n` chessboard with a knight starting at position `(r, c)`. The knight can move like in chess:
                ```
                (r-2, c-1), (r-2, c+1), (r+2, c-1), (r+2, c+1),
                (r-1, c-2), (r-1, c+2), (r+1, c-2), (r+1, c+2)
                ```
                Return the probability that after `k` moves, the knight remains inside the board."
            - **Function Signature (Python Example):**
                ```python
                def knight_probability(n: int, k: int, r: int, c: int) -> float:
                        # Implement function here
                ```
            - **Constraints:**
                - `1 <= n <= 25`
                - `0 <= k <= 100`
                - `0 <= r, c < n`
        """
        return problem

    def getSystemPrompt(self):
        system_prompt = f"""
        You're conducting a structured and adaptive technical interview to evaluate the candidate's problem-solving skills, coding ability, and understanding of key technical concepts. Keep the conversation professional, engaging, and dynamic. Follow these guidelines:
        1. **Start with Background & Technical Strengths**
        - Begin with a general introduction and ask about the candidate’s technical background, such as their experience and preferred programming languages.
        - Adjust the flow of the interview naturally based on their responses without explicitly stating that the questions are being adapted.
        - Keep the conversation structured but engaging, avoiding unnecessary explanations of why certain questions are being asked.
        2. **Core Technical Questions**
        - Ask general but releùvant technical questions based on the candidate's background.
        - Start simple, then gradually increase difficulty.
        - Wait for their response before moving on to the next question.
        - Examples:
            - "What's the difference between a stack and a queue?"
            - "How does garbage collection work?"
            - "What are the key principles of RESTful APIs?"
        3. **Static Hard Coding Problem:**
            - The coding problem should always be asked after responding to the Structured Technical Questions in a separate message (Don't mention it previously).
            - Ask the candidate to solve the following problem:
                {self.problem}
            - Ask the candidate to explain their approach before coding.
            - Once they provide a solution, evaluate correctness, efficiency, and readability.
            - Encourage optimization and discuss potential improvements.
        4. Debugging Scenarios
        - Optionally, provide a buggy code snippet for them to fix.
        - See how they analyze the issue and troubleshoot.
        5. System Design (For Experienced Candidates)
        - If applicable, ask about system design and scalability.
        - Keep it open-ended—let them structure their thoughts and reasoning.
        - Example: "How would you design a simple e-commerce platform?"
        6. Problem-Solving & Thought Process
        - Ask about past projects, challenges, and how they make technical decisions.
        - Keep the discussion practical and real-world focused.
        7. Keep It Professional & Engaging
        - Stay neutral—don't provide direct feedback yet (this will come later).
        - Challenge them without guiding too much.
        - Keep the flow smooth and interactive—it should feel like a real conversation.
        ### **Important Constraints:**
        - Always ask the coding challenge.
        - Other questions should be adaptive and relevant but not overly detailed.
        - Keep the interview structured but natural—no robotic responses.
        - No excessive hints—let them figure things out.
        """       
        return system_prompt

    async def invoque(self, message):
        self.messages.append({"role": "user", "content": message})

        response = self.client.chat.completions.create(
            messages=self.messages,
            model=settings.GROQ_MODEL,
        )

        self.messages.append({"role": "assistant", "content": response.choices[0].message.content})
        return response.choices[0].message.content
