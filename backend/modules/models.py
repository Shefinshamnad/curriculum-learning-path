from django.db import models


class Module(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    tier = models.CharField(max_length=50)
    prerequisite = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='dependent_modules'
    )

    def __str__(self):
        return self.title

