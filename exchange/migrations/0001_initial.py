# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import uuid


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Sheet',
            fields=[
                ('sheet_no', models.UUIDField(default=uuid.uuid4, serialize=False, editable=False, primary_key=True)),
                ('source_currency', models.CharField(max_length=3)),
                ('source_amount', models.IntegerField(default=0)),
                ('target_currency', models.CharField(max_length=3)),
                ('target_amount', models.IntegerField(default=0)),
            ],
        ),
    ]
