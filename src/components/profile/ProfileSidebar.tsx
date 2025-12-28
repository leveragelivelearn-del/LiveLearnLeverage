import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { User, Shield, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface ProfileSidebarProps {
    user: {
        name: string
        email: string
        image?: string
        role: string
        createdAt: string | Date
    }
}

export function ProfileSidebar({ user }: ProfileSidebarProps) {
    return (
        <Card className="h-fit">
            <CardHeader className="text-center">
                <div className="mx-auto w-32 h-32 relative mb-4">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-primary/10 relative">
                        {user.image ? (
                            <Image
                                src={user.image}
                                alt={user.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                <User className="h-12 w-12 text-primary" />
                            </div>
                        )}
                    </div>
                </div>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm p-3 bg-secondary/20 rounded-lg">
                    <Shield className="h-4 w-4 text-primary" />
                    <div>
                        <p className="font-medium">Role</p>
                        <p className="text-muted-foreground capitalize">{user.role}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-sm p-3 bg-secondary/20 rounded-lg">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                        <p className="font-medium">Joined</p>
                        <p className="text-muted-foreground">{formatDate(user.createdAt)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
