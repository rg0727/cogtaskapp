from google.oauth2 import service_account
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
import datetime
from openai import OpenAI
from urllib.request import urlopen
import json
import socket
import requests


def get_ip():
    hostname = socket.gethostname()
    IPAddr = socket.gethostbyname(hostname)
    return IPAddr


client = OpenAI(api_key="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")
import re
import os

SCOPES = ['https://www.googleapis.com/auth/calendar']
SERVICE_ACCOUNT_FILE = '/Users/rakshagovind/gcalagent/glassy-tube-445906-i6-c1672dc1a980.json'


creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)

service = build('calendar', 'v3', credentials=creds)

def process_user_input(user_input):
    prompt = f"""
    User provided the following audio input: "{user_input}".
    Validate the input with the embedding provided and give a score of 1-5 based on the quality of the goal.
    """
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        store=True,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return completion.choices[0].message.content

def parse_event_details(response):
    print(response)
    lines = response.split('%')
    title = lines[0]
    description = lines[1]
    print(title)
    print(description)
    return title, description


def main():
    user_input = input("What goal would you like to achieve? ")
    ai_response = process_user_input(user_input)
    summary, description = parse_event_details(ai_response)
    print(ai_loc_response)
    start_time = datetime.datetime(2024, 12, 26, 13, 0, 0) 
    end_time = start_time + datetime.timedelta(minutes=30)

if __name__ == '__main__':
    main()

