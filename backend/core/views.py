import os
import re
import json
from datetime import datetime
from django.conf import settings
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from google import genai
from google.generativeai.types import content_types
from .serializers import UIAnalyzeSerializer


@api_view(["POST", "GET"])
@parser_classes([MultiPartParser, FormParser])
def analyze_ui_view(request):
    serializer = UIAnalyzeSerializer(data=request.data)
    if serializer.is_valid():
        image = serializer.validated_data["image"]

        # Create a unique filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        original_name = os.path.splitext(image.name)[0]
        extension = os.path.splitext(image.name)[1]
        new_filename = f"{original_name}_{timestamp}{extension}"

        upload_dir = os.path.join(settings.MEDIA_ROOT, "ui_uploads")

        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, new_filename)

        with open(file_path, "wb+") as destination:
            for chunk in image.chunks():
                destination.write(chunk)

        analysis_result = analyze_ui(file_path)

        return Response(analysis_result, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def fake_analyze_ui(image):
    return {
        "overallScore": 72,
        "improvements": [
            "Increase spacing between buttons.",
            "Text contrast is low, consider darker font.",
            "Dropdown is not labeled clearly.",
        ],
        "strengths": [
            "Consistent button styling.",
            "Clear text field labels.",
            "Good use of whitespace.",
        ],
        "metrics": {
            "accessibility": 65,
            "consistency": 75,
            "usability": 80,
            "visualDesign": 68,
        },
    }


def analyze_ui(image_path):
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

    prompt = """
    You are a professional UI/UX design reviewer. Your task is to analyze a screenshot of a user interface and return a JSON response evaluating the UI on various design aspects.

    ### Your Goals:
    1. Assess the image for common design principles such as accessibility, consistency, usability, and visual design.
    2. Highlight both **strengths** and **improvements** found in the UI.
    3. Provide an **overallScore** between 0 and 100 reflecting the general quality of the UI.
    4. Return specific **metric scores** for each of the following categories:
        - Accessibility (0–100)
        - Consistency (0–100)
        - Usability (0–100)
        - VisualDesign (0–100)

    ### Output Format:
    Respond ONLY with a valid JSON in the structure below:

    ```json
    {
    "overallScore": <integer>,
    "improvements": [
        "<clear, actionable suggestion 1>",
        "<suggestion 2>",
        ...
    ],
    "strengths": [
        "<positive observation 1>",
        "<positive observation 2>",
        ...
    ],
    "metrics": {
        "accessibility": <integer>,
        "consistency": <integer>,
        "usability": <integer>,
        "visualDesign": <integer>
    }
    }
    """

    image = client.files.upload(file=image_path)

    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=[prompt, image]
    )

    parsed_data = extract_json_from_llm_response(response.text)

    return parsed_data


def extract_json_from_llm_response(text: str) -> dict:
    """
    Extracts a JSON object from an LLM response that may include surrounding text or code blocks.

    Args:
        text (str): The raw text returned by the LLM.

    Returns:
        dict: The parsed JSON dictionary.
    """
    try:
        # Extract JSON between code blocks if present
        json_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
        else:
            # Fallback: try to find the first JSON-looking object
            json_match = re.search(r"(\{.*?\})", text, re.DOTALL)
            if not json_match:
                raise ValueError("No JSON object found in the response.")
            json_str = json_match.group(1)

        return json.loads(json_str)

    except (json.JSONDecodeError, ValueError) as e:
        print(f"Error extracting JSON: {e}")
        return {}
