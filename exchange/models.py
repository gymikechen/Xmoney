import uuid

from django.db import models

class Sheet(models.Model):
    sheet_no = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    source_currency = models.CharField(max_length=3)
    source_amount = models.IntegerField(default=0)
    target_currency = models.CharField(max_length=3)
    target_amount = models.IntegerField(default=0)
