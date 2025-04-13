FUNCTION handleTicketInput(ticket):
    # Step 1: Extract key details from ticket
    issue_text = ticket.description
    category = ticket.category

    # Step 2: Prepare data payload
    payload = {
        "text": issue_text,
        "category": category
    }

    # Step 3: Send POST request to AI endpoint
    response = POST to /api/ai-suggest/ with payload

    # Step 4: Check response for suggestion
    IF response.status == 200:
        suggestion = response.data["suggestion"]
        DISPLAY suggestion in UI under the ticket
    ELSE:
        DISPLAY "No suggestions available. Please try again later."

END FUNCTION
