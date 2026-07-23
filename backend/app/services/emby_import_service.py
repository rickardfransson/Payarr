from sqlalchemy.orm import Session

from app.services.emby import EmbyClient

from app.models.emby_account import EmbyAccount
from app.models.user import User

from app.core.security import hash_password



class EmbyImportService:


    @staticmethod
    async def get_import_preview(
        db: Session,
    ):

        client = EmbyClient()

        emby_users = await client.get_users()


        linked_ids = {
            account.emby_user_id
            for account in db.query(EmbyAccount).all()
        }


        result = []


        for user in emby_users:

            result.append(
                {
                    "emby_user_id": user["Id"],
                    "username": user["Name"],

                    "enabled": (
                        user.get("Policy", {})
                        .get("IsDisabled") is not True
                    ),

                    "imported": (
                        user["Id"]
                        in linked_ids
                    ),
                }
            )


        return result




    @staticmethod
    async def import_user(
        db: Session,
        emby_user_id: str,
    ):


        client = EmbyClient()


        emby_user = await client.get_user(
            emby_user_id
        )


        if not emby_user:

            raise Exception(
                "Emby user not found"
            )



        existing = (
            db.query(EmbyAccount)
            .filter(
                EmbyAccount.emby_user_id == emby_user_id
            )
            .first()
        )


        if existing:

            raise Exception(
                "Emby user already imported"
            )



        username = emby_user["Name"]



        user = User(

            username=username,

            email=(
                f"{emby_user_id}"
                "@import.payarr"
            ),

            password_hash=hash_password(
                emby_user_id
            ),

            active=True,
        )



        db.add(user)

        db.flush()



        account = EmbyAccount(

            user_id=user.id,

            emby_user_id=emby_user_id,

            emby_username=username,

            status="waiting_subscription",

            enabled=True,

        )



        db.add(account)

        db.commit()



        db.refresh(user)


        return {

            "success": True,

            "user_id": user.id,

            "username": username,

            "status": "waiting_subscription"

        }