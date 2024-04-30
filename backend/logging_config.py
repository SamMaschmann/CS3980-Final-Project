import logging
def setup_logging():
    logger = logging.getLogger()
    if not logger.hasHandlers():  # Check if the root logger already has handlers
        logging.basicConfig(
            level=logging.INFO,
            filename="backend.log",
            format="%(asctime)s: %(name)s: %(levelname).4s - %(message)s"
        )
        
        # Create console handler and set level to debug
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
    
        # Create formatter and add it to the handlers
        formatter = logging.Formatter("%(asctime)s: %(name)s: %(levelname).4s - %(message)s")
        console_handler.setFormatter(formatter)
    
        # Add the console handler to the root logger
        logger.addHandler(console_handler)
