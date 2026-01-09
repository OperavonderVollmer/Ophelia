import asyncio
import json
import base64
import sys
import socket



# example token: AAABALoxDDs4zN7bRtZ9LPuO7WFlgGSvidpEszGqoUMZr83UKrTSKhd5ubYrC6QI2cqRCOkoTgbApZgn4PUZHPuz52NMD8Kt2sevBnOtqFajHdwqDtTgZTV-m6EtBa0bTMnUsZW_2egypPLSORG6gs9zM6TmFpdqfSosmKIG3pWzgq0EEzCzkYN9DSqVPaDsRZBvGwaHH7uUGS9du3Ye6SuGVRGBZN2lKtAE9cNsWBDgYPf7KFX0EAVMR_Cp07gPXtHGpN4_2fZMLgXtyVHTrjamTjR2FxM8ssyLc0LJXofNwrbfoAn_zir1WybKbiRPr-M4v0ubSTB6o7QtDKcF6SKgRVdnQUFBQUFCcFlRazNjVFlFemN4V0NQWEc0MEVSMGlCTVRTUmtwenpubnpkOHcxNmJGYVBXaVY2eHJ4bDlUWTV1LXhWUnMydk50TWFPT2k4Q3JhLWY2SDNHUUFELUZ2b0doNUh0T2FxQ3pyQnNqMnd2MWJLVU5yeV95Z1dTSDlLSGxmamhEb2l5WHFfUg==
token = input("Enter your token: ") 
ipaddress = input("Enter IP: ")
port = input("Enter Port: ")

async def test():

    try:
        reader, writer = await asyncio.open_connection(ipaddress, port)
    except Exception as e:
        print(f"Connection failed: {e}")
        return False
    
    try:
        writer.write(token.encode("ascii"))
        await writer.drain()

        response = await asyncio.wait_for(reader.read(1024), timeout=10)
        response = response.decode("ascii")
        print(f"Response: {response}")
    
    finally:
        writer.close()
        await writer.wait_closed()
        return True
    

if __name__ == "__main__":

    asyncio.run(test())

    