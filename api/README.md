# Virtual Interview Coach API

## Getting Started

To start the API, follow these steps:

1. Create a virtual environment:
    ```sh
    python -m venv .venv
    ```

2. Activate the virtual environment:
    - On Windows:
        ```sh
        .venv\Scripts\activate
        ```
    - On macOS/Linux:
        ```sh
        source .venv/bin/activate
        ```

3. Install the required dependencies:
    ```sh
    pip install -r requirements.txt
    ```

4. Run the API:
    ```sh
    uvicorn app:app --host localhost --port 8000 
    ```

Now the API should be up and running.
To access Swagger of the API, use this path:

```sh
http://localhost:8000/docs
```

